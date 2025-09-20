import { Container, Typography, Card, CardContent, CardMedia, Link, Avatar } from '@mui/material';
import Header from '../components/HEADER';
import Me from '../assets/Me.jpg'; // Make sure to add your photo here

function AboutUsPage() {
    const githubLink = "https://github.com/juanvictorqwerty/Ben-the-Archivist"; // Replace with your GitHub profile link
    const yourName = "Juan Mike"; // Replace with your name
    const yourEmail = "juanvictor.mike@ictuniversity.edu.cm"; // Replace with your email

    return (
        <>
            <Header />
            <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Thank You!
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    Thank you all for using our website. We hope you enjoyed it.
                </Typography>
                <Typography variant="body1" sx={{ mb: 4 }}>
                    We are open to your contributions! Check out our project on{' '}
                    <Link href={githubLink} target="_blank" rel="noopener noreferrer">
                        GitHub
                    </Link>.
                </Typography>

                <Card 
                    sx={{ 
                        maxWidth: 345, 
                        m: 'auto', 
                        boxShadow: 3,
                        borderRadius: 2
                    }}
                >
                    <CardMedia
                        sx={{ display: 'flex', justifyContent: 'center', pt: 3 }}
                    >
                        <Avatar
                            alt={yourName}
                            src={Me}
                            sx={{ width: 140, height: 140, border: '2px solid white' }}
                        />
                    </CardMedia>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {yourName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Contributor of Bob the Archivist
                        </Typography>
                        <Link href={`mailto:${yourEmail}`} variant="body2" sx={{ mt: 1, display: 'block' }}>
                            {yourEmail}
                        </Link>
                    </CardContent>
                </Card>
            </Container>
        </>
    );
}

export default AboutUsPage;