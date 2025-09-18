import React from 'react';
import { Card, CardContent, Typography, Button, Box, Chip, useMediaQuery } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import ArticleIcon from '@mui/icons-material/Article';

interface DocumentCardProps {
  title: string;
  teacher: string;
  exam_semester: string;
  exam_year: number;
  uploader: string;
  file: string;
  onDownload: () => void;
}

function getFileIcon(fileName: string) {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return <PictureAsPdfIcon color="error" fontSize="large" />;
  if (ext === 'doc' || ext === 'docx') return <DescriptionIcon color="primary" fontSize="large" />;
  if (ext === 'txt') return <ArticleIcon color="action" fontSize="large" />;
  return <InsertDriveFileIcon color="disabled" fontSize="large" />;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ title, teacher, exam_semester, exam_year, uploader, file, onDownload }) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  return (
    <Card
      sx={{
        mb: 3,
        boxShadow: 4,
        borderRadius: 3,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        p: isMobile ? 1 : 2,
        transition: 'box-shadow 0.3s',
        '&:hover': {
          boxShadow: 8,
        },
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: 2 }}>
        <Box sx={{ minWidth: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {getFileIcon(file)}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant={isMobile ? 'subtitle1' : 'h6'} fontWeight="bold" noWrap>{title}</Typography>
          <Chip label={file.split('/').pop()} color="default" size={isMobile ? 'small' : 'medium'} sx={{ mt: 1, mb: 1 }} />
          <Typography variant="body2" color="text.secondary">Teacher: {teacher}</Typography>
          <Typography variant="body2" color="text.secondary">Semester: {exam_semester}</Typography>
          <Typography variant="body2" color="text.secondary">Year: {exam_year}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Uploaded by: <b>{uploader}</b></Typography>
        </Box>
        <Box sx={{ mt: isMobile ? 2 : 0, width: isMobile ? '100%' : 'auto', textAlign: isMobile ? 'center' : 'right' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={onDownload}
            sx={{
              py: isMobile ? 1 : 1.5,
              px: isMobile ? 2 : 4,
              borderRadius: 2,
              fontWeight: 'bold',
              fontSize: isMobile ? '1rem' : '1.1rem',
              boxShadow: '0 2px 8px rgba(33,203,243,0.15)',
              textTransform: 'none',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
                transform: 'translateY(-2px)',
              },
            }}
            fullWidth={isMobile}
          >
            Download
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;
