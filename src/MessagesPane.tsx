import { useEffect, useState } from "react";
import Chip from "@mui/joy/Chip";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";
import ChatBubble from "./ChatBubble";

type User = {
  login: string;
  avatar_url: string;
};

type Issue = {
  id: number;
  created_at: string;
  user: User;
  number: number;
  title: string;
  body: string;
  state: string;
  comments_url: string;
};

type Comment = {
  id: number;
  created_at: string;
  user: User;
  body: string;
};

interface MessagesPaneProps {
  issueUrl: string;
  filteredUser?: string;
}

export default function MessagesPane({ issueUrl, filteredUser }: MessagesPaneProps) {
  const [issueData, setIssueData] = useState<Issue | null>(null); // Données de l'issue
  const [commentsData, setCommentsData] = useState<Comment[]>([]); // Données des commentaires
  const [filteredComments, setFilteredComments] = useState<Comment[]>([]); // Commentaires filtrés
  const [loadingIssue, setLoadingIssue] = useState(true); // État de chargement pour l'issue
  const [loadingComments, setLoadingComments] = useState(true); // État de chargement pour les commentaires
  const [error, setError] = useState<string | null>(null); // État pour les erreurs

  // Récupère les données de l'issue et des commentaires
  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const response = await fetch(issueUrl);
        if (response.status === 404) {
          // Si l'issue n'est pas trouvée, il va afficher un message d'erreur
          setError("Issue not found");
          setLoadingIssue(false);
          return;
        }
        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }
        const data = await response.json();
        setIssueData(data);
        setError(null);
        setLoadingIssue(false);

        // Récupération des commentaires de l'issue
        if (data.comments_url) {
          const commentsResponse = await fetch(data.comments_url);
          if (!commentsResponse.ok) {
            throw new Error(`HTTP status ${commentsResponse.status}`);
          }
          const comments = await commentsResponse.json();
          setCommentsData(comments);
          setLoadingComments(false);
        }
      } catch (err: any) {
        // Gestion des erreurs
        setError(err.message);
        setLoadingIssue(false);
        setLoadingComments(false);
      }
    };

    fetchIssue();
  }, [issueUrl]);

  // Filtre les commentaires en fonction de l'utilisateur filtré
  useEffect(() => {
    if (filteredUser) {
      setFilteredComments(commentsData.filter((comment) => comment.user.login === filteredUser));
    } else {
      setFilteredComments(commentsData);
    }
  }, [filteredUser, commentsData]); // Dépendances sur l'utilisateur filtré et les commentaires

  // Gestion des états de chargement et des erreurs
  if (loadingIssue) {
    return <div style={{ padding: "16px", textAlign: "center" }}>Loading issue...</div>;
  }

  if (error) {
    return <div style={{ padding: "16px", textAlign: "center" }}>{error}</div>;
  }

  if (!issueData) {
    return <div style={{ padding: "16px", textAlign: "center" }}>Issue not found</div>;
  }

  // Destructuration des données de l'issue
  const issueUser = issueData.user;
  const issueBody = issueData.body;

  // Couleur du cercle en fonction de l'état de l'issue
  const statusColor = issueData.state === "open" ? "#4CAF50" : "#F44336";

  return (
    <Sheet
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f4f6f8",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Stack
        direction="column"
        justifyContent="space-between"
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          backgroundColor: "#0B6BCB",
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
        }}
        py={2}
        px={3}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box
            sx={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: statusColor,
            }}
          />
          <Typography
            fontWeight="bold"
            fontSize="1.5rem"
            component="h2"
            noWrap
            sx={{
              display: "flex",
              alignItems: "center",
              color: "#ffffff",
              gap: 1,
            }}
          >
            {issueData.title}
            <Chip
              variant="solid"
              size="sm"
              color="neutral"
              sx={{
                borderRadius: "4px",
                backgroundColor: "#ffffff",
                color: "#0B6BCB",
                fontWeight: "bold",
                fontSize: "0.875rem",
              }}
            >
              #{issueData.number}
            </Chip>
          </Typography>
        </Stack>
        <Typography level="body-sm" sx={{ fontStyle: "italic", color: "#ffffff" }}>
          {issueUser ? issueUser.login : "Unknown user"}
        </Typography>
      </Stack>
      {loadingComments && <div style={{ padding: "16px", textAlign: "center" }}>Loading comments...</div>}
      {error && !loadingIssue && <div style={{ padding: "16px", textAlign: "center" }}>Error loading comments</div>}
      {filteredComments.length > 0 ? (
        <Stack spacing={2} justifyContent="flex-start" px={2} py={3}>
          <ChatBubble variant="solid" body={issueBody} created_at={issueData.created_at} user={issueUser} />
          {filteredComments.map((comment) => (
            <ChatBubble
              key={comment.id}
              variant={comment.user?.login === issueUser?.login ? "solid" : "outlined"}
              body={comment.body}
              created_at={comment.created_at}
              user={comment.user}
            />
          ))}
        </Stack>
      ) : (
        <div style={{ padding: "16px", textAlign: "center" }}>No comments available</div>
      )}
    </Sheet>
  );
}
