import { Box, Typography, Avatar } from "@mui/joy";

type UsersProps = {
  users: { login: string; avatar_url: string }[]; // Liste des utilisateurs avec leur identifiant et URL de l'avatar
  onUserClick: (login: string) => void; // Fonction de rappel pour le clic sur un utilisateur
};

export default function UsersList({ users, onUserClick }: UsersProps) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography
        level="body-xs"
        fontWeight="bold"
        mb={2}
        width="100%"
        textAlign="center"
        fontSize="lg"
        sx={{ color: "#ffffff", bgcolor: "#0B6BCB", p: 2 }}
      >
        List of users participating in the conversation
      </Typography>

      <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2} justifyItems="center">
        {users.map((user) => (
          <Box
            key={user.login} // Clé unique pour chaque utilisateur
            display="flex"
            alignItems="center"
            m={1}
            onClick={() => onUserClick(user.login)} // Appel de la fonction de rappel lors du clic sur un utilisateur
            sx={{ cursor: "pointer" }}
          >
            <Avatar src={user.avatar_url} alt={user.login} />
            <Typography ml={1} fontSize="xs">
              {user.login}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
