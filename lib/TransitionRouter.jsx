'use client'

import { TransitionRouter } from 'next-transition-router'

export default function TransitionProvider({ children }) {
  const fadeTransition = {
    leave: (next) => {
      const body = document.body
      body.style.transition = 'opacity 0.3s ease-out'
      body.style.opacity = '0'
      setTimeout(next, 300)
    },
    enter: (next) => {
      const body = document.body
      body.style.opacity = '0'
      setTimeout(() => {
        body.style.transition = 'opacity 0.3s ease-in'
        body.style.opacity = '1'
        next()
      }, 50)
    }
  }

  const slideTransition = {
    leave: (next) => {
      const main = document.querySelector('main') || document.body
      main.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      main.style.opacity = '0'
      main.style.transform = 'translateX(-50px)'
      setTimeout(next, 500)
    },
    enter: (next) => {
      const main = document.querySelector('main') || document.body
      main.style.opacity = '0'
      main.style.transform = 'translateX(50px)'
      
      setTimeout(() => {
        main.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        main.style.opacity = '1'
        main.style.transform = 'translateX(0)'
        next()
      }, 50)
    }
  }

  const scaleTransition = {
    leave: (next) => {
      const main = document.querySelector('main') || document.body
      main.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      main.style.opacity = '0'
      main.style.transform = 'scale(0.95)'
      setTimeout(next, 400)
    },
    enter: (next) => {
      const main = document.querySelector('main') || document.body
      main.style.opacity = '0'
      main.style.transform = 'scale(1.05)'
      
      setTimeout(() => {
        main.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        main.style.opacity = '1'
        main.style.transform = 'scale(1)'
        next()
      }, 50)
    }
  }

  // Choose your preferred transition
  const currentTransition = fadeTransition  // Change this!

  return (
    <TransitionRouter
      auto={true}
      leave={currentTransition.leave}
      enter={currentTransition.enter}
    >
      {children}
    </TransitionRouter>
  )
}
