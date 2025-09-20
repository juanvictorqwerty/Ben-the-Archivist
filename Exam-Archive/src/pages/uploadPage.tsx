import React, { useState, type JSX } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    TextField,
    Button,
    Grid,
    MenuItem,
    Alert,
    CircularProgress,
    IconButton,
    Stack
} from '@mui/material';
import {
    CloudUpload,
    InsertDriveFile,
    Close,
    CheckCircle,
    Error
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Header from "../components/HEADER";
import API_URL from '../context/apiConfig';

interface UploadBoxProps {
    isDragActive: boolean;
}

interface FormData {
    title: string;
    teacher: string;
    exam_semester: string;
    exam_year: string;
}

type UploadStatus = 'success' | 'error' | null;

const UploadBox = styled(Box)<UploadBoxProps>(({ theme, isDragActive }) => ({
    border: `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.grey[400]}`,
    borderRadius: theme.spacing(2),
    padding: theme.spacing(4),
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: isDragActive ? theme.palette.primary.main + '08' : theme.palette.grey[50],
    '&:hover': {
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.main + '05'
    }
}));

const HiddenInput = styled('input')({
    display: 'none'
});

function Upload(): JSX.Element {
    const [dragActive, setDragActive] = useState<boolean>(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [uploadStatus, setUploadStatus] = useState<UploadStatus>(null);
    const [formData, setFormData] = useState<FormData>({
        title: '',
        teacher: '',
        exam_semester: '',
        exam_year: ''
    });

    const handleDrag = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const removeFile = (): void => {
        setFile(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        setUploadStatus(null);

        const uploadData = new FormData();
        uploadData.append('file', file);
        uploadData.append('title', formData.title);
        uploadData.append('teacher', formData.teacher);
        uploadData.append('exam_semester', formData.exam_semester);
        uploadData.append('exam_year', formData.exam_year);

        try {
            const response = await fetch(`${API_URL}/papers/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`
                },
                body: uploadData
            });

            if (response.ok) {
                setUploadStatus('success');
                setFile(null);
                setFormData({
                    title: '',
                    teacher: '',
                    exam_semester: '',
                    exam_year: ''
                });
            } else {
                const errorData = await response.json();
                console.error('Upload error:', errorData);
                alert('Please log in to upload documents');
                setUploadStatus('error');
            }
        } catch (error) {
            console.error('Upload error:', error);
            setUploadStatus('error');
        } finally {
            setUploading(false);
        }
    };

    const handleUploadBoxClick = (): void => {
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        if (fileInput) {
            fileInput.click();
        }
    };

    const handleRemoveFileClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.stopPropagation();
        removeFile();
    };

    return (
        <>
            <Header />
            <Box
                sx={{
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                    py: 6
                }}
            >
                <Container maxWidth="md">
                    {/* Header */}
                    <Box textAlign="center" mb={4}>
                        <Typography 
                            variant="h3" 
                            component="h1" 
                            fontWeight="bold" 
                            color="text.primary"
                            mb={1}
                        >
                            Upload Document
                        </Typography>
                        <Typography 
                            variant="h6" 
                            color="text.secondary"
                        >
                            Share your exam papers and study materials
                        </Typography>
                    </Box>

                    {/* Upload Form */}
                    <Paper 
                        elevation={8}
                        sx={{ 
                            p: 4, 
                            borderRadius: 3,
                            background: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        <Box component="form" onSubmit={handleSubmit}>
                            <Stack spacing={3}>
                                {/* File Upload Area */}
                                <UploadBox
                                    isDragActive={dragActive}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    onClick={handleUploadBoxClick}
                                >
                                    <HiddenInput
                                        id="file-input"
                                        type="file"
                                        onChange={handleFileSelect}
                                        accept=".pdf,.doc,.docx,.txt"
                                    />
                                    
                                    {!file ? (
                                        <Stack spacing={2} alignItems="center">
                                            <CloudUpload 
                                                sx={{ 
                                                    fontSize: 64, 
                                                    color: 'primary.main',
                                                    opacity: 0.7
                                                }} 
                                            />
                                            <Typography variant="h6" fontWeight="medium">
                                                Drop your file here, or{' '}
                                                <Typography 
                                                    component="span" 
                                                    color="primary" 
                                                    fontWeight="bold"
                                                >
                                                    browse
                                                </Typography>
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Supports: PDF, DOC, DOCX, TXT
                                            </Typography>
                                        </Stack>
                                    ) : (
                                        <Paper 
                                            elevation={1} 
                                            sx={{ 
                                                p: 2, 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'space-between',
                                                bgcolor: 'grey.50'
                                            }}
                                        >
                                            <Box display="flex" alignItems="center" gap={2}>
                                                <InsertDriveFile color="primary" sx={{ fontSize: 32 }} />
                                                <Box>
                                                    <Typography variant="subtitle1" fontWeight="medium">
                                                        {file.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <IconButton 
                                                onClick={handleRemoveFileClick}
                                                size="small"
                                            >
                                                <Close />
                                            </IconButton>
                                        </Paper>
                                    )}
                                </UploadBox>

                                {/* Form Fields */}
                                <Grid container spacing={3}>
                                    
                                        <TextField
                                            fullWidth
                                            label="Document Title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Mathematics Final Exam 2024"
                                            required
                                            variant="outlined"
                                        />
                                    
                                    
                                    
                                        <TextField
                                            fullWidth
                                            label="Teacher/Professor"
                                            name="teacher"
                                            value={formData.teacher}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Dr. Smith"
                                            required
                                            variant="outlined"
                                        />
                                    
                                    
                                    
                                        <TextField
                                            select
                                            fullWidth
                                            label="Semester"
                                            name="exam_semester"
                                            value={formData.exam_semester}
                                            onChange={handleInputChange}
                                            required
                                            variant="outlined"
                                        >
                                            <MenuItem value="Fall">Fall</MenuItem>
                                            <MenuItem value="Spring">Spring</MenuItem>
                                            <MenuItem value="Summer">Summer</MenuItem>
                                        </TextField>
                                    
                                    
                                    
                                        <TextField
                                            fullWidth
                                            type="number"
                                            label="Year"
                                            name="exam_year"
                                            value={formData.exam_year}
                                            onChange={handleInputChange}
                                            placeholder="2024"
                                            inputProps={{ min: 2000, max: 2030 }}
                                            required
                                            variant="outlined"
                                        />
                                    </Grid>
                                

                                {/* Status Messages */}
                                {uploadStatus === 'success' && (
                                    <Alert 
                                        severity="success" 
                                        icon={<CheckCircle />}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        Document uploaded successfully!
                                    </Alert>
                                )}

                                {uploadStatus === 'error' && (
                                    <Alert 
                                        severity="error" 
                                        icon={<Error />}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        Upload failed.
                                    </Alert>
                                )}

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    disabled={!file || uploading}
                                    startIcon={uploading ? <CircularProgress size={20} /> : <CloudUpload />}
                                    sx={{
                                        py: 2,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontSize: '1.1rem',
                                        fontWeight: 'bold',
                                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                        boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 6px 20px 2px rgba(33, 203, 243, .4)'
                                        },
                                        '&:disabled': {
                                            background: 'grey.300',
                                            color: 'grey.500'
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {uploading ? 'Uploading...' : 'Upload Document'}
                                </Button>
                            </Stack>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </>
    );
}

export default Upload;