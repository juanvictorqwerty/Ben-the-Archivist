import React from 'react';
import { Card, CardContent, Typography, Button, Box, Chip, Divider, useMediaQuery } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import ArticleIcon from '@mui/icons-material/Article';
import DownloadIcon from '@mui/icons-material/Download';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface DocumentCardProps {
  title: string;
  teacher: string;
  exam_semester: string;
  exam_year: number;
  uploader: string;
  file: string;
  onDownload: () => void;
  onDelete?: () => void;
}

function getFileIcon(fileName: string) {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return <PictureAsPdfIcon color="error" fontSize="large" />;
  if (ext === 'doc' || ext === 'docx') return <DescriptionIcon color="primary" fontSize="large" />;
  if (ext === 'txt') return <ArticleIcon color="action" fontSize="large" />;
  return <InsertDriveFileIcon color="disabled" fontSize="large" />;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ 
  title, 
  teacher, 
  exam_semester, 
  exam_year, 
  uploader, 
  file, 
  onDownload,
  onDelete
}) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        borderRadius: 4,
        background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
        border: '1px solid rgba(0,0,0,0.04)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
          '& .download-btn': {
            background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
          }
        },
      }}
    >
      <CardContent 
        sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          p: 3,
        }}
      >
        {/* File Icon Section */}
        <Box 
          sx={{ 
            mb: 3,
            p: 2,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 80,
            minHeight: 80,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          {getFileIcon(file)}
        </Box>

        {/* Title Section */}
        <Typography 
          variant="h6" 
          fontWeight="bold" 
          sx={{ 
            mb: 2,
            color: '#1e293b',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '3.2em',
          }}
        >
          {title}
        </Typography>

        {/* File Name Chip */}
        <Chip 
          label={file.split('/').pop()} 
          color="primary"
          variant="outlined"
          size="small"
          sx={{ 
            mb: 3,
            fontWeight: 500,
            backgroundColor: 'rgba(33, 150, 243, 0.08)',
            borderColor: 'rgba(33, 150, 243, 0.2)',
          }} 
        />

        {/* Details Section */}
        <Box sx={{ width: '100%', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
            <SchoolIcon sx={{ fontSize: 18, color: '#64748b', mr: 1 }} />
            <Typography variant="body2" color="#475569" fontWeight="500">
              {teacher}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
            <DateRangeIcon sx={{ fontSize: 18, color: '#64748b', mr: 1 }} />
            <Typography variant="body2" color="#475569">
              {exam_semester}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
            <CalendarTodayIcon sx={{ fontSize: 18, color: '#64748b', mr: 1 }} />
            <Typography variant="body2" color="#475569">
              {exam_year}
            </Typography>
          </Box>

          <Divider sx={{ my: 2, borderColor: 'rgba(0,0,0,0.08)' }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PersonIcon sx={{ fontSize: 18, color: '#64748b', mr: 1 }} />
            <Typography variant="body2" color="#475569">
              Uploaded by <strong style={{ color: '#1e293b' }}>{uploader}</strong>
            </Typography>
          </Box>
        </Box>

        {/* Spacer to push button to bottom */}
        <Box sx={{ flex: 1 }} />

        {/* Download Button */}
        <Button
          variant="contained"
          onClick={onDownload}
          startIcon={<DownloadIcon />}
          className="download-btn"
          sx={{
            width: '100%',
            py: 1.5,
            borderRadius: 3,
            fontWeight: 600,
            fontSize: '0.95rem',
            textTransform: 'none',
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            boxShadow: '0 4px 16px rgba(33, 150, 243, 0.3)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(33, 150, 243, 0.4)',
            },
          }}
        >
          Download
        </Button>
        {onDelete && (
          <Button
            variant="outlined"
            color="error"
            onClick={onDelete}
            sx={{
              width: '100%',
              mt: 1,
              py: 1.2,
              borderRadius: 3,
              fontWeight: 600,
              fontSize: '0.95rem',
              textTransform: 'none',
            }}
          >
            Delete
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentCard;