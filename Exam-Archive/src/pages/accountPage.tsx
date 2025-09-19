import { useEffect, useState } from 'react';
import Header from "../components/HEADER";
import DocumentCard from "../components/DocumentCard";
import { Toolbar, Container, Typography, CircularProgress, Box } from '@mui/material';

function AccountPage() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDocuments() {
            try {
                const response = await fetch('http://127.0.0.1:8000/papers/');
                if (response.ok) {
                    const data = await response.json();
                    // Get current username from localStorage/sessionStorage
                    const username = localStorage.getItem('username') || sessionStorage.getItem('username');
                    // Filter documents to only those published by the user
                    const userDocs = username ? data.filter((doc: any) => doc.username === username) : [];
                    setDocuments(userDocs);
                }
            } catch (error) {
                console.error('Error fetching documents:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchDocuments();
    }, []);

    const handleDownload = (id: number) => {
        window.open(`http://127.0.0.1:8000/papers/${id}/download/`, '_blank');
    };

    return (
        <>
            <Header />
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                {loading ? (
                    <Box textAlign="center" mt={4}><CircularProgress /></Box>
                ) : (
                    documents.length === 0 ? (
                        <Typography>No documents found.</Typography>
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
                            {documents.map((doc: any) => (
                                <DocumentCard
                                    key={doc.id}
                                    title={doc.title}
                                    teacher={doc.teacher}
                                    exam_semester={doc.exam_semester}
                                    exam_year={doc.exam_year}
                                    uploader={doc.username || 'Unknown'}
                                    file={doc.file}
                                    onDownload={() => handleDownload(doc.id)}
                                />
                            ))}
                        </Box>
                    )
                )}
            </Container>
        </>
    );
}

export default AccountPage;