
"use client"

import { useParams, useRouter } from "next/navigation";

export default function TryspeedRoot() {
    const { slug } = useParams();
    const route = useRouter()
    console.log(slug)

    if (slug) {
        route.replace(`/buy-coins/${slug}/success`)
    }
    return null
}
