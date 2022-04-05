import { Authenticator } from '@aws-amplify/ui-react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useState, useEffect } from 'react';
import '@aws-amplify/ui-react/styles.css';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Comment from '@mui/icons-material/Comment'
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Backdrop from '@mui/material/Backdrop';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { Container } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import AddIcon from '@mui/icons-material/Add';
import { Stack } from '@mui/material';

import * as amplify from './amplify'

const Wrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(5, 0, 8, 0)
}))

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


function App() {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState()
  const [description, setDescription] = useState("")
  const [comment, setComment] = useState("")
  const [commentImage, setCommentImage] = useState({viewComments: false, imageURL: '', imageID: '', userpostname: '',comments: [] })
  const [posts, setImgPosts] = useState([])

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleCloseComments = () => setCommentImage({viewComments: false})

  async function handleOpenComments(imgURL, imgID, username) {
    const comments = await amplify.getComments(imgID)
    setCommentImage({viewComments: true, imageURL: imgURL, imageID: imgID, userpostname: username, comments: comments})
  }

  const createComment = async event => {
    event.preventDefault()
    await amplify.createComment(commentImage.imageID, comment, commentImage.userpostname)
    handleOpenComments(commentImage.imageURL, commentImage.imageID, commentImage.userpostname)
    const posts = await amplify.getPosts()
    posts.sort((a, b) => new Date(b.created) - new Date(a.created))
    setImgPosts(posts)
  }

  async function deleteComment(commentId) {
    await amplify.deleteComment(commentImage.imageID, commentId, commentImage.userpostname)
    handleOpenComments(commentImage.imageURL, commentImage.imageID, commentImage.userpostname)
    const posts = await amplify.getPosts()
    posts.sort((a, b) => new Date(b.created) - new Date(a.created))
    setImgPosts(posts)
  }

  async function likePost(imgID, userpostname) {
    await amplify.likePost(imgID, userpostname)
    const posts = await amplify.getPosts()
    posts.sort((a, b) => new Date(b.created) - new Date(a.created))
    setImgPosts(posts)
  }

  async function deletePost(imgID) {
    await amplify.deletePost(imgID)
    const posts = await amplify.getPosts()
    posts.sort((a, b) => new Date(b.created) - new Date(a.created))
    setImgPosts(posts)
  }


  useEffect(() => {
    async function getPosts() {
      const posts = await amplify.getPosts()
      posts.sort((a, b) => new Date(b.created) - new Date(a.created))
      setImgPosts(posts)
    }
    getPosts()
  }, [])

  const uploadImage = async event => {
    event.preventDefault()
    await amplify.createPost(description, file)
    const posts = await amplify.getPosts()
    posts.sort((a, b) => new Date(b.created) - new Date(a.created))
    setImgPosts(posts)
    handleClose()
    
  }

  return (
    <>
    <Authenticator>
    {({ signOut, user }) => (
      <main>
      <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Welcome to instaPat {user.username}!
                </Typography>
                <IconButton aria-label='newpost' onClick={handleOpen}>
                  <AddIcon fontSize='large' color="inherit" />
                </IconButton>
                <Button color="inherit" onClick={signOut}>Logout</Button>
              </Toolbar>
            </AppBar>
          </Box>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2" sx={{pb: 2}}>
                Upload New Post
              </Typography>
                <form onSubmit={uploadImage}>
                <input onChange={e => setFile(e.target.files[0])} type="file" accept="image/*" />
                <TextField  
                  id="outlined-multiline-static"
                  label="Description"
                  multiline
                  rows={4}
                  onChange={e => setDescription(e.target.value)}
                  sx={{m: 2}} />
                <Button type='submit' variant="contained">Post Image</Button> 
                </form>
            </Box>
          </Modal>
          <Wrapper sx={{ width: '100%', bgcolor: '#CACCCE'}}>
            <Container>
            <Stack spacing={2} alignItems="center">
            {posts.map(i => (
           
            <Card sx={{ width: 345 }} key={i.id}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: red[500] }} aria-label="profle">
                </Avatar>
              }
              action={
                user.username === i.PK.replace("USER#", "") ? 
                <IconButton aria-label="delete" onClick={() => deletePost(i.id)} >
                  <DeleteIcon />
                </IconButton> : ""
              }
              title={i.PK.replace("USER#", "")}
              subheader={new Date(i.created).toLocaleDateString('en-US')}
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
                <IconButton aria-label="like" onClick={() => likePost(i.id, i.PK.replace("USER#", ""))}>
                <FavoriteIcon />
                </IconButton>
                <Typography>{i.likeCount}</Typography>
                <IconButton aria-label="comment" onClick={() => handleOpenComments(i.imageUrl, i.id, i.PK.replace("USER#", ""))} >
                  <Comment />
                </IconButton>
                <Typography>{i.commentCount}</Typography>
              </CardActions>
            </Card>
            
          ))}
            </Stack>
            </Container>
          </Wrapper>
          {commentImage.viewComments ?
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
          >
            <ClickAwayListener onClickAway={handleCloseComments}>
            <Card sx={{ display: 'flex', height: 500, width: 700 }}>
              <CardMedia 
                component="img"
                sx={{ width: 350 }}
                image={commentImage.imageURL}
                alt="Cannot Display Image" />
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent>
                <List sx={{ width: '100%', maxWidth: 'auto', bgcolor: 'background.paper' }}>
                   {commentImage.comments.map(c => (
                      <ListItem alignItems="flex-start" key={c.id} secondaryAction={
                        user.username === c.username ?
                        <IconButton edge="end" aria-label="delete" onClick={() => deleteComment(c.id)}>
                          <DeleteIcon />
                        </IconButton> : ""
                      }>
                        <ListItemAvatar>
                          <Avatar alt="PIC" >
                            
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={c.username}
                            secondary={c.text}>

                        </ListItemText>
                      </ListItem>
                   ))}
                </List>
                <Divider sx={{ mb: 2}} />
                <form onSubmit={createComment}>
                  <input onChange={e => setComment(e.target.value)} type="text" />
                  <button type="submit" >Comment</button>
                </form>
                </CardContent>
              </Box>
            </Card>
            </ClickAwayListener>
        </Backdrop> : <Typography></Typography>}
          </main>
    )}
    </Authenticator>
    </>

  );
}

export default App;
