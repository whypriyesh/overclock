import * as THREE from 'three'
import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Image, ScrollControls, Scroll, useScroll } from '@react-three/drei'
import { proxy, useSnapshot } from 'valtio'
import { easing } from 'maath'

const material = new THREE.LineBasicMaterial({ color: 'white' })
const geometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, -0.5, 0),
    new THREE.Vector3(0, 0.5, 0)
])

// Destination data with online images and numeric budgets for currency conversion
const destinations = [
    { name: 'Santorini', country: 'Greece', minBudget: 2500, maxBudget: 4000, days: '5-7 days', image: 'https://loremflickr.com/800/1200/Santorini,travel' },
    { name: 'Bali', country: 'Indonesia', minBudget: 1200, maxBudget: 2500, days: '7-10 days', image: 'https://loremflickr.com/800/1200/Bali,travel' },
    { name: 'Swiss Alps', country: 'Switzerland', minBudget: 3000, maxBudget: 5500, days: '5-8 days', image: 'https://loremflickr.com/800/1200/Swiss,Alps,mountain' },
    { name: 'Maldives', country: 'Maldives', minBudget: 3500, maxBudget: 6000, days: '5-7 days', image: 'https://loremflickr.com/800/1200/Maldives,beach' },
    { name: 'Tokyo', country: 'Japan', minBudget: 2000, maxBudget: 3500, days: '7-10 days', image: 'https://loremflickr.com/800/1200/Tokyo,city,neon' },
    { name: 'Iceland', country: 'Iceland', minBudget: 2800, maxBudget: 4500, days: '6-9 days', image: 'https://loremflickr.com/800/1200/Iceland,aurora' },
    { name: 'Dubai', country: 'UAE', minBudget: 2200, maxBudget: 4000, days: '4-6 days', image: 'https://loremflickr.com/800/1200/Dubai,skyscraper' },
    { name: 'Paris', country: 'France', minBudget: 2500, maxBudget: 4200, days: '5-7 days', image: 'https://loremflickr.com/800/1200/Paris,Eiffel' },
    { name: 'New York', country: 'USA', minBudget: 2800, maxBudget: 5000, days: '5-8 days', image: 'https://loremflickr.com/800/1200/NewYork,city' },
    { name: 'Machu Picchu', country: 'Peru', minBudget: 1800, maxBudget: 3200, days: '6-8 days', image: 'https://loremflickr.com/800/1200/MachuPicchu,ruins' },
    { name: 'Outback', country: 'Australia', minBudget: 3200, maxBudget: 5500, days: '8-12 days', image: 'https://loremflickr.com/800/1200/Australia,outback' },
    { name: 'Fjords', country: 'Norway', minBudget: 3500, maxBudget: 6000, days: '7-10 days', image: 'https://loremflickr.com/800/1200/Norway,fjord' },
]

export const state = proxy({
    clicked: null,
    selectedPackage: 0,
    destinations: destinations
})

function Minimap() {
    const ref = useRef()
    const scroll = useScroll()
    const { destinations } = useSnapshot(state)
    const { height } = useThree((state) => state.viewport)

    useFrame((s, delta) => {
        ref.current.children.forEach((child, index) => {
            const y = scroll.curve(index / destinations.length - 1.5 / destinations.length, 4 / destinations.length)
            easing.damp(child.scale, 'y', 0.1 + y / 4, 0.1, delta)
        })
    })

    return (
        <group ref={ref}>
            {destinations.map((_, i) => (
                <line
                    key={i}
                    geometry={geometry}
                    material={material}
                    position={[i * 0.06 - destinations.length * 0.03, -height / 2 + 0.6, 0]}
                />
            ))}
        </group>
    )
}

function Item({ index, position, scale, destination, ...props }) {
    const ref = useRef()
    const scroll = useScroll()
    const { clicked, destinations } = useSnapshot(state)
    const [hovered, hover] = useState(false)

    const click = () => (state.clicked = index === clicked ? null : index)

    useFrame((s, delta) => {
        if (!ref.current) return

        const y = scroll.curve(index / destinations.length - 1.5 / destinations.length, 4 / destinations.length)
        const isActive = clicked === index

        // Snappier easing
        const speed = 0.08

        // Scale animation - wider cards when active
        easing.damp3(
            ref.current.scale,
            [isActive ? 4.5 : scale[0], isActive ? 5 : 4 + y, 1],
            speed,
            delta
        )

        if (ref.current.material) {
            ref.current.material.scale[0] = ref.current.scale.x
            ref.current.material.scale[1] = ref.current.scale.y
        }

        // Position animation
        if (clicked !== null && index < clicked) {
            easing.damp(ref.current.position, 'x', position[0] - 2, speed, delta)
        } else if (clicked !== null && index > clicked) {
            easing.damp(ref.current.position, 'x', position[0] + 2, speed, delta)
        } else {
            easing.damp(ref.current.position, 'x', position[0], speed, delta)
        }

        // Grayscale and color
        if (ref.current.material) {
            easing.damp(ref.current.material, 'grayscale', hovered || isActive ? 0 : Math.max(0, 1 - y), speed, delta)
        }
    })

    return (
        <Image
            ref={ref}
            {...props}
            position={position}
            scale={scale}
            onClick={click}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
        />
    )
}

function Items({ w = 1.0, gap = 0.15 }) {
    const { destinations } = useSnapshot(state)
    const { width } = useThree((state) => state.viewport)
    const xW = w + gap

    return (
        <ScrollControls horizontal damping={0.06} pages={(width - xW + destinations.length * xW) / width}>
            <Minimap />
            <Scroll>
                {destinations.map((destination, i) => (
                    <Item
                        key={i}
                        index={i}
                        position={[i * xW, 0, 0]}
                        scale={[w, 4, 1]}
                        url={destination.image}
                        destination={destination}
                    />
                ))}
            </Scroll>
        </ScrollControls>
    )
}

export function Gallery() {
    const { clicked } = useSnapshot(state)

    // Lock vertical scroll when an image is expanded and scroll into view
    useEffect(() => {
        if (clicked !== null) {
            // Check if gallery section is fully visible
            const gallerySection = document.getElementById('gallery')
            if (gallerySection) {
                const rect = gallerySection.getBoundingClientRect()
                const isFullyVisible = rect.top >= 0 && rect.bottom <= window.innerHeight

                // If not fully visible, scroll to it
                if (!isFullyVisible) {
                    gallerySection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
            }

            // Lock scroll after a small delay to allow scrollIntoView to complete
            setTimeout(() => {
                document.body.style.overflow = 'hidden'
            }, 500)
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [clicked])

    return (
        <Canvas
            gl={{ antialias: false }}
            dpr={[1, 1.5]}
            onPointerMissed={() => (state.clicked = null)}
        >
            <Items />
        </Canvas>
    )
}
