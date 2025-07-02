import * as React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
  },
}));

export default function NavbarBreadcrumbs({ selectedRecording, onNavigateToList }) {
  const handleDatasetsClick = () => {
    if (selectedRecording && onNavigateToList) {
      onNavigateToList();
    }
  };

  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      <Typography 
        variant="body1" 
        sx={{ 
          cursor: selectedRecording ? 'pointer' : 'default',
          color: selectedRecording ? 'primary.main' : 'text.primary',
          '&:hover': selectedRecording ? { textDecoration: 'underline' } : {}
        }}
        onClick={handleDatasetsClick}
      >
        Datasets
      </Typography>
      {selectedRecording && (
        <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600 }}>
          Subject #{selectedRecording.subjectId} - Session #{selectedRecording.sessionId}
        </Typography>
      )}
    </StyledBreadcrumbs>
  );
}