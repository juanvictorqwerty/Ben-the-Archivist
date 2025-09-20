
import { useState } from "react";
import { Container, Box, TextField, Button, Typography, Alert } from "@mui/material";
import API_URL from "../context/apiConfig";

function EmailRecovery() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess("");
        setError("");
        try {
            const response = await fetch(`${API_URL}/api/password-reset/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (response.ok) {
                setSuccess("Recovery email sent! Check your inbox.");
            } else {
                setError(data.error || "Failed to send recovery email.");
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Box
                sx={{
                    p: 4,
                    background: "#f8fafc",
                    borderRadius: 4,
                    boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}
            >
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                    Recover your password
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", maxWidth: 400 }}>
                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        fullWidth
                        required
                        sx={{ mb: 3, background: "#fff", borderRadius: 2 }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{
                            width: "100%",
                            py: 1.5,
                            borderRadius: 3,
                            fontWeight: 600,
                            fontSize: "1rem",
                            textTransform: "none",
                            background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                            boxShadow: "0 4px 16px rgba(33, 150, 243, 0.15)",
                        }}
                    >
                        {loading ? "Sending..." : "Send Recovery Email"}
                    </Button>
                </Box>
                {success && <Alert severity="success" sx={{ mt: 3 }}>{success}</Alert>}
                {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}
            </Box>
        </Container>
    );
}

export default EmailRecovery;

