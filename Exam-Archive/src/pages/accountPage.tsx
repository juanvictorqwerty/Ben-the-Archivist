import { useEffect, useState } from 'react';
import Header from "../components/HEADER";
import DocumentCard from "../components/DocumentCard";
import { Toolbar, Container, Typography, CircularProgress, Box } from '@mui/material';
import API_URL from '../context/apiConfig';

function AccountPage() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Refetch documents function
    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/papers/`);
            if (response.ok) {
                const data = await response.json();
                const username = localStorage.getItem('username') || sessionStorage.getItem('username');
                const userDocs = username ? data.filter((doc: any) => doc.username === username) : [];
                setDocuments(userDocs);
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleDownload = (id: number) => {
        window.open(`${API_URL}/download/${id}/`, '_blank');
    };
    // Get current username once for use in rendering
    const username = localStorage.getItem('username') || sessionStorage.getItem('username');

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`${API_URL}/papers/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                },
            });
            if (response.ok) {
                // Refresh the documents list after deletion
                await fetchDocuments();
            } else {
                alert('Failed to delete document');
            }
        } catch (error) {
            alert('Error deleting document');
        }
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
                                    onDelete={username === doc.username ? () => handleDelete(doc.id) : undefined}
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