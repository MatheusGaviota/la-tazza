import Carousel from '@/components/UI/Carousel';
import CourseCard from '@/components/Cards/CourseCard';
import Link from 'next/link';
import type { Course } from '@/hooks/useHomeData';

export default function CoursesSection({ courses, loading }: { courses: Course[]; loading: boolean }) {
  return (
    <section className="w-full max-w-[1400px] mx-auto flex flex-col items-center px-4 py-15">
      <h2 className="font-alumni text-4xl sm:text-5xl md:text-6xl font-semibold text-foreground">Domine a Arte do Café</h2>
      <p className="sm:text-center text-base sm:text-lg text-foreground max-w-185 mt-3">Conheça os cursos mais bem avaliados do momento, desenvolvidos para aprimorar suas habilidades no mundo do café.</p>

      <div className="w-full text-left sm:text-right mt-4 sm:order-last sm:mb-0 sm:mt-4">
        <Link href="/cursos" className="inline-flex items-center gap-2 text-foreground hover:text-accent transition-colors text-base sm:text-base font-medium">Ver todos os cursos</Link>
      </div>

      <div className="mt-6 sm:mt-8 w-full">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-accent/5 border border-accent/20 rounded-lg p-6 animate-pulse">
                <div className="aspect-video bg-accent/20 rounded-lg mb-4"></div>
                <div className="h-6 bg-accent/20 rounded mb-2"></div>
                <div className="h-4 bg-accent/20 rounded mb-4"></div>
                <div className="h-4 bg-accent/20 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : courses.length > 0 ? (
          <Carousel
            items={courses.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                imageUrl={course.imageUrl || ''}
                title={course.title || ''}
                description={course.description || ''}
                duration={course.duration || ''}
                level={course.level || ''}
                price={course.price || ''}
              />
            ))}
            desktopColumns={3}
          />
        ) : (
          <div className="text-center py-12 text-foreground/70">
            <p>Nenhum curso disponível no momento.</p>
          </div>
        )}
      </div>
    </section>
  );
}
