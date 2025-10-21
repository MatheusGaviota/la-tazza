import Image from "next/image";

interface CourseCardProps {
    imageUrl: string;
    title: string;
}

export default function CourseCard({ imageUrl, title }: CourseCardProps) {
    return (
        <article className="group cursor-pointer relative overflow-hidden rounded-xl bg-accent aspect-[5/3] transition-transform duration-300 hover:scale-[1.02] focus-within:scale-[1.02]">
            <Image
                src={imageUrl}
                alt={title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-fill transition-opacity duration-300 group-hover:opacity-90"
                priority={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/0 to-foreground/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </article>
    );
}
