import { useState } from 'react'
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function ImageCard({images}) {
    const [expanded, setExpanded] = useState(false);
    const [imgs, setImages] = useState([])
  
    const handleExpandClick = () => {
      setExpanded(!expanded);
    };

    const getImages = images.map(i => {
        setImages(...imgs, i)
    })
  
    return (
        <><div>
        {posts.map(i => (
                <Card sx={{ maxWidth: 345 }}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: red[500] }} aria-label="profle">
                      USER
                    </Avatar>
                  }
                  title={i.PK}
                  subheader={i.created}
                />
                <CardMedia
                  component="img"
                  height="300"
                  image={i.imageUrl}
                  alt="Cannot Display"
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {i.description}
                  </Typography>
                </CardContent>
                <CardActions disableSpacing>
                  <IconButton aria-label="like">
                    <FavoriteIcon />
                  </IconButton>
                  <IconButton aria-label="comment" onClick={handleOpenComments}>
                    <Comment />
                  </IconButton>
                </CardActions>
              </Card>
            ))}
          </div></>
    )
}