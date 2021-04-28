import { mount } from "@vue/test-utils"
import Home from "./Home.vue"
import flushPromises from "flush-promises"
import { basePost } from "./mocks"
import TimeLinePost from "./TimeLinePost.vue"
import * as mockData from "./mocks"
import { createStore } from "./store"

jest.mock("axios", () => ({
    get: (url: string) => ({
        data: [mockData.thisWeek, mockData.todayPost, mockData.thisMonth]

    })
})
)

//easy access wrapper with provide and mount
const createHome = () => {
    return mount(Home, {
        global: {
            provide: {
                store: createStore()
            }
        }
    })
}

describe("Home", () => {

    // PERIOD TESTING
    it("renders a loader", () => {
        const wrapper = createHome()
        expect(wrapper.find("[data-test='loader']").exists()).toBe(true)
    })

    it("renders three time periods", async () => {
        const wrapper = createHome()

        await flushPromises()
        expect(wrapper.findAll("[data-test='period']")).toHaveLength(3)
    })

    it("updated period when clicked", async () => {
        const wrapper = createHome()

        await flushPromises()

        //select array item from period, check if it contains class of is-active
        const $today = wrapper.findAll("[data-test='period'")[0]
        expect($today.classes()).toContain("is-active")

        const $thisWeek = wrapper.findAll("[data-test='period'")[1]
        await $thisWeek.trigger("click") //trigger click event -- await = re-render after each update
        expect($today.classes()).not.toContain("is-active")
        expect($thisWeek.classes()).toContain("is-active")

        const $thisMonth = wrapper.findAll("[data-test='period'")[2]
        await $thisMonth.trigger("click")
        expect($today.classes()).not.toContain("is-active")
        expect($thisWeek.classes()).not.toContain("is-active")
        expect($thisMonth.classes()).toContain("is-active")
    })

    it("renders todays post by default", async () => {
        const wrapper = createHome()

        await flushPromises()

        // today
        expect(wrapper.findAll("[data-test='post'")).toHaveLength(1)

        // this week
        const $thisWeek = wrapper.findAll("[data-test='period'")[1]
        await $thisWeek.trigger("click")
        expect(wrapper.findAll("[data-test='post'")).toHaveLength(2)

        // this month
        const $thisMonth = wrapper.findAll("[data-test='period'")[2]
        await $thisMonth.trigger("click")
        expect(wrapper.findAll("[data-test='post'")).toHaveLength(3)
    })

    // POST TESTING
    it("renders a post title", () => {
        const wrapper = mount(TimeLinePost, {
            props: {
                post: {
                    ...basePost
                }
            }
        })
        expect(wrapper.find("[data-test='post-title']").text()).toBe(wrapper.vm["post"].title)
    })

    it("renders a post created", () => {
        const wrapper = mount(TimeLinePost, {
            props: {
                post: {
                    ...basePost
                }
            }
        })
        expect(wrapper.find("[data-test='post-created']").text()).toBe(wrapper.vm["post"].created.format("Do MMM"))
    })
})