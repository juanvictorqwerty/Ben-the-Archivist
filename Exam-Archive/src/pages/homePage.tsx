import React, { useEffect, useState } from 'react';
import Header from "../components/HEADER";
import DocumentCard from "../components/DocumentCard";
import { Toolbar, Container, Typography, CircularProgress, Box } from '@mui/material';

function HomePage() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDocuments() {
            try {
                const response = await fetch('http://127.0.0.1:8000/papers/');
                if (response.ok) {
                    const data = await response.json();
                    setDocuments(data);
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
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Typography variant="h4" fontWeight="bold" mb={3}>All Documents</Typography>
                {loading ? (
                    <Box textAlign="center" mt={4}><CircularProgress /></Box>
                ) : (
                    documents.length === 0 ? (
                        <Typography>No documents found.</Typography>
                    ) : (
                        documents.map((doc: any) => (
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
                        ))
                    )
                )}
            </Container>
        </>
    );
}

export default HomePage;