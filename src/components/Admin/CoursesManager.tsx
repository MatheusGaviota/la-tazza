'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import CourseFormModal from './CourseFormModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { Course } from '@/types/admin.types';
import { getCourses, deleteCourse } from '@/lib/admin.service';
import Image from 'next/image';

export default function CoursesManager() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = courses.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.level.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses(courses);
    }
  }, [searchTerm, courses]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await getCourses();
      setCourses(data);
      setFilteredCourses(data);
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedCourse(null);
    setIsModalOpen(true);
  };

  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (course: Course) => {
    setCourseToDelete(course);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!courseToDelete) return;

    try {
      await deleteCourse(courseToDelete.id);
      await loadCourses();
      setIsDeleteModalOpen(false);
      setCourseToDelete(null);
    } catch (error) {
      console.error('Erro ao deletar curso:', error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
    loadCourses();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 z-[2]"
              size={20}
            />
            <Input
              type="text"
              placeholder="Buscar cursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Button onClick={handleAdd} variant="accent">
          <Plus size={20} />
          <span>Adicionar Curso</span>
        </Button>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="text-center py-12 bg-background border-2 border-dashed border-foreground/20 rounded-lg">
          <p className="text-foreground/60 mb-4">Nenhum curso encontrado</p>
          <Button onClick={handleAdd} variant="accent">
            <Plus size={20} />
            <span>Adicionar Primeiro Curso</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <article
              key={course.id}
              className="border-2 border-foreground rounded-lg overflow-hidden bg-background"
            >
              <div className="relative w-full h-48">
                <Image
                  src={course.imageUrl}
                  alt={course.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-4">
                <div className="flex gap-2 mb-3">
                  <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded">
                    {course.level}
                  </span>
                  <span className="text-xs font-medium text-foreground bg-foreground/10 px-2 py-1 rounded">
                    {course.duration}
                  </span>
                </div>
                <h3 className="font-alumni text-2xl font-bold text-foreground mb-2">
                  {course.title}
                </h3>
                <p className="text-sm text-foreground/70 mb-3 line-clamp-2">
                  {course.description}
                </p>
                <div className="mb-4">
                  <span className="font-alumni text-2xl font-bold text-accent">
                    {course.price}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(course)}
                    variant="ghost-accent"
                  >
                    <Pencil size={18} />
                    <span>Editar</span>
                  </Button>
                  <Button
                    onClick={() => handleDeleteClick(course)}
                    variant="danger"
                  >
                    <Trash2 size={18} />
                    <span>Excluir</span>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <CourseFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        course={selectedCourse}
      />
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={courseToDelete?.title || ''}
        itemType="curso"
      />
    </div>
  );
}
