import axios from "axios"
import { inject, provide, reactive, readonly } from "vue"
import { Post, User, Author } from "./types"



interface PostsState {
    ids: string[] //array of ids
    all: Record<string, Post> // map from string to post
    loaded: boolean // check if key is loaded
}

interface AuthorsState {
    ids: string[]
    all: Record<string, Author>
    loaded: boolean,
    currentUserId?: string
}

// interface SessionState{}

interface State {
    authors: AuthorsState
    posts: PostsState
}

// import { todayPost, thisWeek, thisMonth } from "./mocks";

const initialAuthorsState = (): AuthorsState => ({
    all: {},
    ids: [],
    loaded: false,
    currentUserId: undefined
})

// returns a fresh copy of PostsState
const initialPostState = (): PostsState => ({
    all: {},
    ids: [],
    loaded: false
})

// returns initial state 
const initialState = (): State => ({
    authors: initialAuthorsState(),
    posts: initialPostState()
})

//create store with protected and readonly global access
class Store {
    protected state: State

    constructor(initialState: State) {
        this.state = reactive(initialState)

    }

    public getState() {
        return readonly(this.state)
    }

    async createUser(user: User) {
        const response = await axios.post<Author>('/users', user)
        this.state.authors.all[response.data.id] = response.data
        this.state.authors.ids.push(response.data.id.toString())
        this.state.authors.currentUserId = response.data.id.toString()
        console.log(this.state)
    }

    async createPost(post: Post) {
        const response = await axios.post<Post>('/posts', post)
        this.state.posts.all[response.data.id] = response.data
        this.state.posts.ids.push(response.data.id.toString())
    }

    async fetchPosts() {
        const response = await axios.get<Post[]>('/posts')
        for (const post of response.data) {
            if (!this.state.posts.ids.includes(post.id.toString())) {
                this.state.posts.ids.push(post.id.toString())
            }

            this.state.posts.all[post.id] = post
        }

        this.state.posts.loaded = true
    }
}

//  initialise store 
export const store = new Store(initialState())
store.getState()

export const provideStore = () => {
    provide("store", store)
}

export const createStore = () => {
    return new Store(initialState())
}

export const useStore = (): Store => {
    const store = inject<Store>("store")
    return store
}