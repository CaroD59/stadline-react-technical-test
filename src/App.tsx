import { useState } from "react";
import Box from "@mui/joy/Box";
import CssBaseline from "@mui/joy/CssBaseline";
import { CssVarsProvider } from "@mui/joy/styles";
import MessagesPane from "./MessagesPane";
import Sidebar from "./Sidebar";

export default function App() {
  const [issueUrl, setIssueUrl] = useState("https://api.github.com/repos/facebook/react/issues/7901");

  // État pour l'utilisateur filtré, si un filtre est appliqué
  const [filteredUser, setFilteredUser] = useState<string | undefined>(undefined);

  // Met à jour l'URL de l'issue
  const handleIssueChange = (url: string) => {
    setIssueUrl(url);
  };

  // Applique un filtre sur les commentaires en fonction de l'utilisateur
  const handleFilterCommentsByUser = (login: string) => {
    if (login === "") {
      setFilteredUser(undefined); // Réinitialise le filtre si une chaîne vide est passée
    } else {
      setFilteredUser(login); // Applique le filtre basé sur le login de l'utilisateur
    }
  };

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100dvh" }}>
        <Box component="aside" sx={{ width: 300 }}>
          <Sidebar onIssueChange={handleIssueChange} onFilterCommentsByUser={handleFilterCommentsByUser} />
        </Box>
        <Box component="main" sx={{ flex: 1 }}>
          <MessagesPane issueUrl={issueUrl} filteredUser={filteredUser} />
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
