import { useState } from "react";
import Header from "../components/HEADER";
import DocumentCard from "../components/DocumentCard";
import { Container, Box, TextField, Button, MenuItem, Typography, CircularProgress } from "@mui/material";

const SEMESTERS = ["Spring", "Summer", "Fall", "Winter"];

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
        let url = `http://127.0.0.1:8000/search/?q=${encodeURIComponent(query)}`;
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
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Box component="form" onSubmit={handleSearch} sx={{ display: "flex", gap: 2, mb: 4 }}>
                    <TextField
                        label="Search"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Year"
                        value={year}
                        onChange={e => setYear(e.target.value)}
                        type="number"
                        sx={{ width: 120 }}
                    />
                    <TextField
                        label="Semester"
                        select
                        value={semester}
                        onChange={e => setSemester(e.target.value)}
                        sx={{ width: 140 }}
                    >
                        <MenuItem value="">All</MenuItem>
                        {SEMESTERS.map(s => (
                            <MenuItem key={s} value={s}>{s}</MenuItem>
                        ))}
                    </TextField>
                    <Button type="submit" variant="contained">Search</Button>
                </Box>
                {loading ? (
                    <Box textAlign="center" mt={4}><CircularProgress /></Box>
                ) : (
                    searched && results.length === 0 ? (
                        <Typography>No results found.</Typography>
                    ) : (
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    sm: 'repeat(2, 1fr)',
                                    md: 'repeat(3, 1fr)'
                                },
                                gap: 3,
                                mt: 2
                            }}
                        >
                            {results.map((doc: any) => (
                                <DocumentCard
                                    key={doc.id}
                                    title={doc.title}
                                    teacher={doc.teacher}
                                    exam_semester={doc.exam_semester}
                                    exam_year={doc.exam_year}
                                    uploader={doc.username || 'Unknown'}
                                    file={doc.file}
                                    onDownload={() => window.open(`http://127.0.0.1:8000/download/${doc.id}/`, '_blank')}
                                />
                            ))}
                        </Box>
                    )
                )}
            </Container>
        </>
    );
}

export default SearchPage;