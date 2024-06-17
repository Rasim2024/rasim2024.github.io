// Замени на свой, чтобы получить независимый от других набор данных.
// "боевая" версия инстапро лежит в ключе prod

const personalKey = 'raasim-musaev'
const baseHost = 'https://webdev-hw-api.vercel.app'
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`

export function getPosts({ token }) {
    return fetch(postsHost, {
        method: 'GET',
        headers: {
            Authorization: token,
        },
    })
        .then(response => {
            if (response.status === 401) {
                throw new Error('Нет авторизации')
            }
            return response.json()
        })
        .then(data => {
            return data.posts
        })
}

export function getUserPosts({ token, userId }) {   
    return fetch(`${postsHost}/user-posts/${userId}`, {
        method: 'GET',
        headers: {
            Authorization: token,
        },
    })
        .then(response => {
            if (response.status === 401) {
                throw new Error('Нет авторизации')
            }
            return response.json()
        })
        .then(data => {
            return data.posts
        })
}

export function addPost({ token, description, imageUrl }) {
    return fetch(postsHost, {
        method: 'POST',
        headers: {
            Authorization: token,
        },
        body: JSON.stringify({ description, imageUrl }),
    }).then(response => {
        if (response.status === 401) {
            throw new Error('Нет авторизации')
        }
        return response.json()
    })
}

export function getLikePost({ token, postId, isLiked }) {
    if (!token) {
        return alert('Поставить лайк, могут только авторизованные пользователи')
    }

    const toggleLikeHost = isLiked === 'true' ? 'dislike' : 'like' // isLiked === 'true' - Это условие проверяет, равно ли значение переменной isLiked строке 'true'. 
    // Если это условие истинно, то вернется значение 'dislike', иначе вернется значение 'like'.

    return fetch(`${postsHost}/${postId}/${toggleLikeHost}`, {
        method: 'POST',
        headers: {
            Authorization: token,
        },
    })
        .then(response => {
            if (response.status === 401) {
                throw new Error('Нет авторизации')
            }
            return response.json()
        })
        .then(data => {
            return data.post
        })
        .catch(error => console.error(error))
}

export function deletePost({ token, postId }) {
    if (!token) {
        return alert('Удалить пост, могут только авторизованные пользователи')
    }

    return fetch(`${postsHost}/${postId}`, {
        method: 'DELETE',
        headers: {
            Authorization: token,
        },
    }).then(response => {
        if (response.status === 401) {
            throw new Error('Нет авторизации')
        }
        return response.json()
    })
}


export function registerUser({ login, password, name, imageUrl }) {
    return fetch(baseHost + '/api/user', {
        method: 'POST',
        body: JSON.stringify({
            login,
            password,
            name,
            imageUrl,
        }),
    }).then(response => {
        if (response.status === 400) {
            throw new Error('Такой пользователь уже существует')
        }
        return response.json()
    })
}

export function loginUser({ login, password }) {
    return fetch(baseHost + '/api/user/login', {
        method: 'POST',
        body: JSON.stringify({
            login,
            password,
        }),
    }).then(response => {
        if (response.status === 400) {
            throw new Error('Неверный логин или пароль')
        }
        return response.json()
    })
}

// Загружает картинку в облако, возвращает url загруженной картинки
export function uploadImage({ file }) {
    const data = new FormData()
    data.append('file', file) // Изображение, переданное в функцию как параметр file, добавляется к объекту FormData под ключом "file".

    return fetch(baseHost + '/api/upload/image', {
        method: 'POST',
        body: data,
    }).then(response => {
        return response.json()
    })
}
