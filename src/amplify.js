import Amplify, { API, Storage } from "aws-amplify"
import awsExports from "./aws-exports"

Amplify.configure(awsExports)

const apiName = 'intaPat'

function randomString(bytes = 16) {
  return Array.from(crypto.getRandomValues(new Uint8Array(bytes))).map(b => b.toString(16)).join("")
}

export async function getPosts() {
  const path = '/images' 
  const result = await API.get(apiName, path)
  console.log(result)
  return await Promise.all(result.map(async item => {
    const imageUrl = await Storage.get(item.imageName);
    return {
      ...item,
      imageUrl
    }
  })) 
}

export async function getUserPosts() {
  const path = '/images/profile' 
  const result = await API.get(apiName, path)
  console.log(result)
  return await Promise.all(result.map(async item => {
    const imageUrl = await Storage.get(item.imageName);
    return {
      ...item,
      imageUrl
    }
  })) 
}

export async function getOtherPosts(userId) {
  const path = `/images/${userId}` 
  const result = await API.get(apiName, path)
  console.log(result)
  return await Promise.all(result.map(async item => {
    const imageUrl = await Storage.get(item.imageName);
    return {
      ...item,
      imageUrl
    }
  }))  
}

export async function createPost(description, file) {
  const { key } = await Storage.put(randomString(), file);
  const path = '/images' 
  const result = await API.post(apiName, path, {
    body: { 
      imageName: key,
      description
    }
  })
  console.log(result)
  return result
}

export async function deletePost(postId) {
  const path = `/images/${postId}`
  const result = await API.del(apiName, path)
  console.log(result)
  return result
}

export async function getComments(postId) {
  const path = `/images/${postId}/comments`
  const comments = await API.get(apiName, path)
  console.log(comments)
  return comments.Items
}

export async function createComment(postId, text, userpostname) {
  const path = `/images/${postId}/${userpostname}/comments`
  const result = await API.post(apiName, path, {
    body: { 
      text
    }
  })
  console.log(result)
  return result
}

export async function deleteComment(postId, commentId, userpostname) {
  const path = `/images/${postId}/${commentId}/${userpostname}/comments`
  const result = await API.del(apiName, path)
  console.log(result)
  return result
}


export async function likePost(postId, userpostname) {
  const path = `/images/${postId}/${userpostname}/likes`
  const result = await API.post(apiName, path)
  console.log(result)
  return result
}







