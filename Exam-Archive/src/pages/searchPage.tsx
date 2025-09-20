import { useState } from "react";
import Header from "../components/HEADER";
import DocumentCard from "../components/DocumentCard";
import { Container, Box, TextField, Button, MenuItem, Typography, CircularProgress } from "@mui/material";
import API_URL from "../context/apiConfig";

const SEMESTERS = ["Spring", "Summer", "Fall"];

function SearchPage() {
    const [query, setQuery] = useState("");
    const [year, setYear] = useState("");
    const [semester, setSemester] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSearched(true);
        let url = `${API_URL}/search/?q=${encodeURIComponent(query)}`;
        if (year) url += `&year=${year}`;
        if (semester) url += `&semester=${encodeURIComponent(semester)}`;
        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                let filtered = data;
                if (year) filtered = filtered.filter((doc: any) => String(doc.exam_year) === year);
                if (semester) filtered = filtered.filter((doc: any) => doc.exam_semester === semester);
                setResults(filtered);
            } else {
                setResults([]);
            }
        } catch {
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <Container maxWidth="md" sx={{ mt: 6 }}>
                <Box
                    component="form"
                    onSubmit={handleSearch}
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 2,
                        mb: 5,
                        p: 3,
                        background: "#f8fafc",
                        borderRadius: 4,
                        boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
                        alignItems: "center"
                    }}
                >
                    <TextField
                        label="Search"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        fullWidth
                        sx={{ minWidth: 180, flex: 2, background: "#fff", borderRadius: 2 }}
                    />
                    <TextField
                        label="Year"
                        value={year}
                        onChange={e => setYear(e.target.value)}
                        type="number"
                        sx={{ width: 120, background: "#fff", borderRadius: 2 }}
                    />
                    <TextField
                        label="Semester"
                        select
                        value={semester}
                        onChange={e => setSemester(e.target.value)}
                        sx={{ width: 140, background: "#fff", borderRadius: 2 }}
                    >
                        <MenuItem value="">All</MenuItem>
                        {SEMESTERS.map(s => (
                            <MenuItem key={s} value={s}>{s}</MenuItem>
                        ))}
                    </TextField>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            px: 4,
                            py: 1.5,
                            borderRadius: 3,
                            fontWeight: 600,
                            fontSize: "1rem",
                            textTransform: "none",
                            background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                            boxShadow: "0 4px 16px rgba(33, 150, 243, 0.15)",
                        }}
                    >
                        Search
                    </Button>
                </Box>
                {loading ? (
                    <Box textAlign="center" mt={6}><CircularProgress /></Box>
                ) : (
                    searched && results.length === 0 ? (
                        <Typography sx={{ mt: 6, textAlign: "center", color: "#64748b" }}>No results found.</Typography>
                    ) : (
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    sm: 'repeat(2, 1fr)',
                                    md: 'repeat(3, 1fr)'
                                },
                                gap: 4,
                                mt: 2,
                                mb: 4
                            }}
                        >
                            {results.map((doc: any) => (
                                <Box
                                    key={doc.id}
                                    sx={{
                                        boxShadow: "0 2px 12px rgba(33,150,243,0.08)",
                                        borderRadius: 4,
                                        background: "#fff",
                                        p: 2,
                                        transition: "box-shadow 0.2s",
                                        '&:hover': {
                                            boxShadow: "0 6px 24px rgba(33,150,243,0.18)"
                                        }
                                    }}
                                >
                                    <DocumentCard
                                        title={doc.title}
                                        teacher={doc.teacher}
                                        exam_semester={doc.exam_semester}
                                        exam_year={doc.exam_year}
                                        uploader={doc.username || 'Unknown'}
                                        file={doc.file}
                                        onDownload={() => window.open(`${API_URL}/download/${doc.id}/`, '_blank')}
                                    />
                                </Box>
                            ))}
                        </Box>
                    )
                )}
            </Container>
        </>
    );
}

export default SearchPage;