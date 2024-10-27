---
slug: why-i-migrated-my-website-from-solidjs-to-astro
title: Why I Migrated My Website From SolidJS to Astro
date: 2024-10-26
updated: 2024-10-27
authors:
  - Richard Dominick
---

I recently migrated my main portfolio site from [SolidJS](https://www.solidjs.com/) to [Astro](https://astro.build/), and I thought that in order to celebrate the launch of the new site, I would write a blog post sharing a little bit about the reason behind the migration. In this post, I will talk about the history of my website, why I decided to migrate it to Astro and what is to come in the future.

## Background

I have two sites that I consider as my "personal" (non-project related) websites:

* My [main portfolio site](https://richarddominick.me/), where I showcase my experience and past projects, as well as
* My [blog](https://richarddominick.me/blog), where I ocassionally write about tech stuff and other things that interest me

> _**Sidenote:** Historically, the blog has always been written using [Jekyll](https://jekyllrb.com/), and while the full migration to Astro includes rewriting the blog and combining its codebase into a single repository, I will only focus on the main site migration in this post._

## A (Not-So-Brief) History of My Site

I experimented with building my portfolio site many times over the years, but for a personal site, no template ever _felt like me_. Eventually, I realized that I just had to design and build it from scratch, without any templates. As someone who enjoys both designing and developing, creating a site from scratch felt like the best way to showcase something that reflects my personal self, and my skills at the same time.

### Considerations Before Development

When I started building my site, I had a vision: I wanted a site that was fast, lightweight, and easy to maintain.

I wanted to be able to write content as data, and have the site logic figure out the rest of the UI. Be it YAML, JSON, or Markdown, it should be as frictionless as possible, so that I could focus on writing and not on things like ensuring style consistency, and so on.

This meant that almost certainly, I was going to have to use a framework, which would allow me to reuse pieces of code as components, as well as add plugins for things like state management or additional functionality.

### The First Portfolio Site

What I consider my first portfolio site ("v1") was born in 2022. It was built using [ReactJS](https://react.dev/), like most Single-Page Apps, but I quickly realized that it was not the correct framework for me. It simply felt too slow for a lot of the things I wanted to do with it. Unfortunately, this meant that I quickly lost motivation and v1 was never fully completed.

### The Second Portfolio Site

So I moved on to [SolidJS](https://www.solidjs.com/) in 2023. It has a code style similar to React, which at that time, was the only frontend framework I was familiar with. SolidJS with its compiler was much faster and more lightweight, so it was the natural choice.

I consider v2 to be the first "real" version of my site, as it was the first one that I actually published with mostly complete content. Around the same time, both my frontend skills, as well as the available libraries in the JS ecosystem, had also improved, and I was able to utilize things like lazy loading, code splitting, and more to make the site even faster.

Even though it was still client side rendered, I was happy with the performance and the overall design of the site. Moreover, Google had started to index client side rendered sites, so I was not too worried about SEO.

### The Migration to Astro

[v2](https://v2.richarddominick.me/) was great and lasted over a year, but while it solved a lot of my problems, it also introduced new ones. I wrote my experiences and projects in YAML files, which is then converted into an object before being rendered on the site. Using Vite, I could move the YAML-to-object conversion from runtime to build time, which gave a performance boost, but the object still contained strings that needed to be parsed and rendered as Markdown, which was not ideal, as the Markdown to HTML conversion had to be done at runtime.

While loading the content asyncrhonously from the main page helped mitigate the performance impact, it actually made another problem _worse_: my website has a section for people to contact me (<https://richarddominick.me/#contact>). By how HTML fragments work, you would expect that clicking the hyperlink takes you directly to the contact section.

Normally, on client-side rendered sites, you can easily mitigate this issue at the page level:

```tsx
const Page = () => {
  const loc = useLocation();
  useEffect(() => {
    if (loc.hash) {
      const el = document.querySelector(loc.hash);
      el?.scrollIntoView();
    }
  }, [loc.hash]);

  return (
    <div>
      <Section1 />
      <Section2 />
      <Section3 />
    </div>
  )
}
```

Consider what happens when you load the content asynchronously. If the content is loaded before the `useEffect` runs, then everything will work as expected. But in most cases, the page will scroll to the location of the hash before the content is loaded. Once the content loads, the entire page then shifts and does not re-scroll to the correct location.

Now, we are faced with a dilemma: do we wrap the `useEffect` in a `setTimeout`? This will give the content time to load, but comes with two trade-offs:

* _First_, **it is a hack** and assumes that the content will load within a reasonable timeframe, thus is not guaranteed to work every time, especially for mobile devices or slow and/or less reliable connections.

* _Second_, it delays the actual scrolling to the correct location. The longer you set the timeout value, the higher the chance it will scroll to the correct location, but the longer users have to wait, which is **not a good user experience**.

---

<!-- TODO: Remember to change the link once v4 becomes default, if ever -->
I have been following Astro very closely since when I first heard about it, and by late 2024, it had matured enough for my liking. Moreover, I was taking a course at university on SEO, so a static site rewrite was a no-brainer. Thus, [v3](https://richarddominick.me/) was born.

## Why I Chose Astro

After migrating my site to Astro, I found it particularly enjoyable and suited for my site for a number of reasons:

### Static Site Generation (SSG)

For a portfolio/blog site, most of the content is static, so using SSG makes a lot of sense. Produce static HTML, it removes the need for anything to be processed client-side at runtime, giving a huge performance boost. Of course, with full static HTML and no more asynchronous rendering, hash fragments is also super easy and works out-of-the-box by the browser, with no additional code needed.

Astro's support for multiple types of [content collections](https://docs.astro.build/en/guides/content-collections/) (like YAML, JSON, and Markdown) also made it easy to migrate my existing content to the new site. Since my blog posts are already in Markdown, and my projects/experiences in YAML, defining the collections was a one-time setup.

I also really like that Astro type-checks these collections, ensuring I don't accidentally mistype or misremember a property name. While I do miss having live typechecking in my editor, it is still way better than not having any typechecks at all, as was the case previously.

### Islands for Interactive Components

Despite all the great benefits of static sites, my website still requires some dynamic and/or interactive components, like a contact form, or a desktop-only [interactive display alternative](https://richarddominick.me/#experience) for my experiences.

Astro's [Islands](https://docs.astro.build/concepts/islands/) feature allows me to still have this interactivity, while keeping the rest of the site static. It also has other benefits, like component isolation, though they are less relevant for my use case. These components are also automatically lazy-loaded only when needed, thereby keeping loading times minimal.

### Customizability

Lastly, the main reason I chose Astro was its customizability. Astro uses [Vite](https://vite.dev/) build tool under the hood, which allows for a lot of customization. There are many available plugins for Rollup and ESBuild, which can be easily integrated into the Astro build process.

As a fan of Markdown, I thoroughly enjoy the customizability of the [Unified/Remark ecosystem](https://remark.js.org/) for Markdown processing. I have been working with the ecosystem for a while now, even including it in my other projects like [glam-mailer](https://glam-mailer.netlify.app/), so I really appreciate being able to write custom plugins, extensions and pipelines that are reusable across projects.

I also envision the use case for my site being a tech blog, so syntax highlighting is a must. I must say I have not used [Shiki](https://shiki.matsu.io/), the syntax highlighter Astro uses, before. But after reading through its documentation, I found it very easy to write custom transformers and even support additional languages for it, with a very similar "pipeline processing" approach, like Remark.

Lastly, having Astro automatically scope CSS to each file, like [Vue](https://vuejs.org/), is a huge plus. It allows me to write CSS without worrying about global styles, and makes it easy to combine different pages with different styles, without worrying about conflicts. This is especially useful for my use case, where I often need to write custom code that is unique to each project page or blog post.

## What's Next and Conclusion

With the main site fully migrated to Astro, and the blog mostly migrated from Jekyll and Ruby to Astro and TypeScript, writing has become a lot more enjoyable and frictionless. I hope that I will be able to write more frequently, publish more articles, and share more of my experiences in the future.

While I did move away from SolidJS, I still think it is a great framework, and I would recommend it to anyone who is looking for a lightweight, fast, and easy-to-use framework, with an approachable API for those who are familiar with React. I will certainly continue to use it for future projects where it makes sense to do so.

However, for my personal site, Astro has become my choice for now, as it allows me to build a site that is not only fast, but easy to maintain and customize to fit my vision. Its integration with very popular, extensible, and plugin-rich ecosystems like Vite, Remark, Zod, and Shiki, makes it a great choice for anyone looking to build a static site that is more than just a simple blog.

Let me know if you would like to see a more in-depth post on any of the topics I mentioned above!

---

_Stay tuned for more writeups on tech!_
