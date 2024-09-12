import React, { useEffect, useState } from "react";
import Input from "@mui/joy/Input";
import Sheet from "@mui/joy/Sheet";
import UsersList from "./UsersList";
import useFetch from "./useFetch";
import Button from "@mui/joy/Button";

interface SidebarProps {
  onIssueChange: (url: string) => void; // Fonction appelée lorsqu'une nouvelle issue est sélectionnée
  onFilterCommentsByUser: (userLogin: string) => void; // Fonction pour filtrer les commentaires par utilisateur
}

type User = {
  login: string;
  avatar_url: string;
};

type Issue = {
  user: User;
  comments_url: string;
};

type Comment = {
  user: User;
};

export default function Sidebar({ onIssueChange, onFilterCommentsByUser }: SidebarProps) {
  const [inputValue, setInputValue] = useState("facebook/react/issues/7901"); // Valeur de l'input initiale
  const [users, setUsers] = useState<User[]>([]); // Liste des utilisateurs à afficher
  const [issueUrl, setIssueUrl] = useState(`https://api.github.com/repos/${inputValue}`); // URL de l'issue

  const issue = useFetch<Issue>({ url: issueUrl });
  const comments = useFetch<Comment[]>({ url: issue.data?.comments_url || "" }, { enabled: !!issue.data });

  // Fonction pour afficher tous les commentaires
  const handleShowAllComments = () => {
    onFilterCommentsByUser(""); // Vide la chaîne pour montrer tous les commentaires
  };

  // Fonction pour gérer le changement dans le champ de saisie
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    handleShowAllComments(); // Réinitialiser le filtre des commentaires lorsqu'on change l'input pour tout rebooter

    // Construit l'URL complète en fonction de la valeur de l'input
    const fullUrl = newValue.startsWith("http") ? newValue : `https://api.github.com/repos/${newValue}`;

    setIssueUrl(fullUrl);
    onIssueChange(fullUrl);
  };

  // Fonction pour gérer le clic sur un utilisateur dans la liste
  const handleUserClick = (login: string) => {
    onFilterCommentsByUser(login);
  };

  // Mets à jour la liste des utilisateurs lorsque les données changent
  useEffect(() => {
    if (issue.data && comments.data) {
      const issueUser = issue.data.user; // Utilisateur ayant créé l'issue
      const commentUsers = comments.data.map((comment) => comment.user); // Utilisateurs des commentaires
      const allUsers = [issueUser, ...commentUsers]; // Combinaison des utilisateurs de l'issue et des commentaires
      const uniqueUsers = Array.from(new Map(allUsers.map((user) => [user.login, user])).values()); // Filtrer les utilisateurs
      setUsers(uniqueUsers);
    }
  }, [issue.data, comments.data]);

  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: "sticky",
        transition: "transform 0.4s, width 0.4s",
        height: "100dvh",
        top: 0,
        p: 2,
        flexShrink: 0, // Empêcher la réduction en taille
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      <Input
        value={inputValue} // Valeur actuellede l'input
        onChange={handleInputChange} // Fonction appelée pour que l'input change
        placeholder="Enter issue URL (e.g., facebook/react/issues/7901)"
      />
      <UsersList users={users} onUserClick={handleUserClick} />
      <Button
        onClick={handleShowAllComments}
        variant="solid"
        sx={{
          color: "#ffffff",
          bgcolor: "#0B6BCB",
          borderRadius: "sm",
          padding: "12px 16px",
          fontSize: "16px",
        }}
      >
        Show all comments
      </Button>
    </Sheet>
  );
}
