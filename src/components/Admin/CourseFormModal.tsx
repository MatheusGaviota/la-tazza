'use client';

import { useState, useEffect } from 'react';
import Input from '@/components/UI/Input';
import { Course } from '@/types/admin.types';
import { createCourse, updateCourse } from '@/lib/admin.service';
import { uploadToCloudinary } from '@/lib/cloudinary-client';
import BaseFormModal from './BaseFormModal';
import ImageUploadField from './ImageUploadField';
import TextareaField from './TextareaField';
import DynamicListField from './DynamicListField';

interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  course?: Course | null;
}

interface FormData {
  title: string;
  description: string;
  fullDescription: string;
  duration: string;
  level: string;
  category: string;
  price: string;
  instructor: string;
  instructorBio: string;
  imageUrl: string;
  certificate: boolean;
  materials: boolean;
  support: boolean;
}

export default function CourseFormModal({
  isOpen,
  onClose,
  course,
}: CourseFormModalProps) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    fullDescription: '',
    duration: '',
    level: 'iniciante',
    category: '',
    price: '',
    instructor: '',
    instructorBio: '',
    imageUrl: '',
    certificate: true,
    materials: true,
    support: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [topics, setTopics] = useState<string[]>([]);
  const [whatYouWillLearn, setWhatYouWillLearn] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [scheduleWeeks, setScheduleWeeks] = useState<string[]>([]);
  const [scheduleContents, setScheduleContents] = useState<string[]>([]);
  const [nextDates, setNextDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title,
        description: course.description,
        fullDescription: course.fullDescription || '',
        duration: course.duration,
        level: course.level,
        category: course.category || '',
        price: course.price,
        instructor: course.instructor || '',
        instructorBio: course.instructorBio || '',
        imageUrl: course.imageUrl,
        certificate: course.certificate ?? true,
        materials: course.materials ?? true,
        support: course.support ?? true,
      });
      setImagePreview(course.imageUrl);
      setTopics(course.topics || []);
      setWhatYouWillLearn(course.whatYouWillLearn || []);
      setRequirements(course.requirements || []);

      const schedule = course.schedule || [];
      setScheduleWeeks(schedule.map((s) => s.week || ''));
      setScheduleContents(schedule.map((s) => s.content || ''));

      setNextDates(course.nextDates || []);
    } else {
      resetForm();
    }
  }, [course, isOpen]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      fullDescription: '',
      duration: '',
      level: 'iniciante',
      category: '',
      price: '',
      instructor: '',
      instructorBio: '',
      imageUrl: '',
      certificate: true,
      materials: true,
      support: true,
    });
    setImageFile(null);
    setImagePreview('');
    setTopics([]);
    setWhatYouWillLearn([]);
    setRequirements([]);
    setScheduleWeeks([]);
    setScheduleContents([]);
    setNextDates([]);
    setErrors({});
  };

  const handleImageChange = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Título é obrigatório';
    if (!formData.description.trim())
      newErrors.description = 'Descrição curta é obrigatória';
    if (!formData.fullDescription.trim())
      newErrors.fullDescription = 'Descrição completa é obrigatória';
    if (!formData.duration.trim()) newErrors.duration = 'Duração é obrigatória';
    if (!formData.level.trim()) newErrors.level = 'Nível é obrigatório';
    if (!formData.category.trim())
      newErrors.category = 'Categoria é obrigatória';
    if (!formData.price.trim()) newErrors.price = 'Preço é obrigatório';
    if (!formData.instructor.trim())
      newErrors.instructor = 'Instrutor é obrigatório';
    if (!formData.instructorBio.trim())
      newErrors.instructorBio = 'Biografia do instrutor é obrigatória';
    if (!imagePreview) newErrors.image = 'Imagem é obrigatória';
    if (topics.length === 0) newErrors.topics = 'Adicione pelo menos um tópico';
    if (whatYouWillLearn.length === 0)
      newErrors.whatYouWillLearn = 'Adicione pelo menos um item de aprendizado';
    if (requirements.length === 0)
      newErrors.requirements = 'Adicione pelo menos um requisito';
    if (scheduleWeeks.length === 0 || scheduleContents.length === 0) {
      newErrors.schedule = 'Adicione pelo menos uma semana no cronograma';
    }
    if (nextDates.length === 0)
      newErrors.nextDates = 'Adicione pelo menos uma data de turma';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleScheduleWeeksChange = (items: string[]) => {
    setScheduleWeeks(items);
    // Ajusta o array de conteúdos para ter o mesmo tamanho
    setScheduleContents((prev) => {
      const newContents = [...prev];
      while (newContents.length < items.length) newContents.push('');
      while (newContents.length > items.length) newContents.pop();
      return newContents;
    });
  };

  const handleScheduleContentChange = (index: number, value: string) => {
    setScheduleContents((prev) => {
      const newContents = [...prev];
      newContents[index] = value;
      return newContents;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      let imageUrl = formData.imageUrl;

      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile, 'courses');
      }

      const schedule = scheduleWeeks.map((week, index) => ({
        week,
        content: scheduleContents[index] || '',
      }));

      const courseData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        fullDescription: formData.fullDescription.trim(),
        duration: formData.duration.trim(),
        level: formData.level.trim(),
        category: formData.category.trim(),
        price: formData.price.trim(),
        instructor: formData.instructor.trim(),
        instructorBio: formData.instructorBio.trim(),
        imageUrl,
        topics,
        whatYouWillLearn,
        requirements,
        schedule,
        nextDates,
        certificate: formData.certificate,
        materials: formData.materials,
        support: formData.support,
      };

      if (course) {
        await updateCourse(course.id, courseData);
      } else {
        await createCourse(courseData);
      }

      onClose();
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar curso:', error);
      setErrors({ submit: 'Erro ao salvar curso. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseFormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={course ? 'Editar Curso' : 'Adicionar Curso'}
      loading={loading}
      submitText={course ? 'Atualizar' : 'Adicionar'}
      maxWidth="4xl"
    >
      <div className="space-y-6 max-h-[70vh] overflow-y-auto px-1">
        {/* Imagem */}
        <ImageUploadField
          label="Imagem do Curso"
          imagePreview={imagePreview}
          onImageChange={handleImageChange}
          error={errors.image}
          required
          aspectRatio="video"
        />

        {/* Informações Básicas */}
        <div className="space-y-4 p-4 bg-accent/5 rounded-lg border-2 border-accent/20">
          <h3 className="font-semibold text-lg text-foreground">
            Informações Básicas
          </h3>

          <Input
            label="Título do Curso"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            error={errors.title}
            required
            placeholder="Ex: Barista Profissional Completo"
          />

          <TextareaField
            id="course-description"
            label="Descrição Curta"
            value={formData.description}
            onChange={(value) =>
              setFormData({ ...formData, description: value })
            }
            error={errors.description}
            required
            rows={2}
            placeholder="Breve descrição do curso (aparece nos cards)"
            maxLength={200}
          />

          <TextareaField
            id="course-full-description"
            label="Descrição Completa"
            value={formData.fullDescription}
            onChange={(value) =>
              setFormData({ ...formData, fullDescription: value })
            }
            error={errors.fullDescription}
            required
            rows={4}
            placeholder="Descrição detalhada do curso (aparece na página do curso)"
            maxLength={1000}
          />
        </div>

        {/* Detalhes do Curso */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Duração"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
            error={errors.duration}
            required
            placeholder="Ex: 40 horas ou 10 semanas"
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nível <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.level}
              onChange={(e) =>
                setFormData({ ...formData, level: e.target.value })
              }
              className="w-full px-4 py-2 border-2 border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              <option value="iniciante">Iniciante</option>
              <option value="intermediario">Intermediário</option>
              <option value="avancado">Avançado</option>
            </select>
            {errors.level && (
              <p className="text-red-500 text-sm mt-1">{errors.level}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Categoria"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            error={errors.category}
            required
            placeholder="Ex: barista, arte-latte, extracao"
          />

          <Input
            label="Preço"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            error={errors.price}
            required
            placeholder="Ex: R$ 1.200,00"
          />
        </div>

        {/* Instrutor */}
        <div className="space-y-4 p-4 bg-accent/5 rounded-lg border-2 border-accent/20">
          <h3 className="font-semibold text-lg text-foreground">
            Informações do Instrutor
          </h3>

          <Input
            label="Nome do Instrutor"
            value={formData.instructor}
            onChange={(e) =>
              setFormData({ ...formData, instructor: e.target.value })
            }
            error={errors.instructor}
            required
            placeholder="Ex: Chef Matteo Rossi"
          />

          <TextareaField
            id="instructor-bio"
            label="Biografia do Instrutor"
            value={formData.instructorBio}
            onChange={(value) =>
              setFormData({ ...formData, instructorBio: value })
            }
            error={errors.instructorBio}
            required
            rows={3}
            placeholder="Experiência, certificações, prêmios..."
            maxLength={500}
          />
        </div>

        {/* Tópicos */}
        <div className="space-y-4 p-4 bg-accent/5 rounded-lg border-2 border-accent/20">
          <h3 className="font-semibold text-lg text-foreground">
            Tópicos do Curso
          </h3>
          <DynamicListField
            label="Tópicos Principais"
            items={topics}
            onItemsChange={setTopics}
            placeholder="Ex: História e cultura do café"
            error={errors.topics}
            required
            maxItems={10}
            helpText="Liste os principais tópicos abordados"
          />
        </div>

        {/* O que você vai aprender */}
        <div className="space-y-4 p-4 bg-accent/5 rounded-lg border-2 border-accent/20">
          <h3 className="font-semibold text-lg text-foreground">
            O Que Você Vai Aprender
          </h3>
          <DynamicListField
            label="Aprendizados"
            items={whatYouWillLearn}
            onItemsChange={setWhatYouWillLearn}
            placeholder="Ex: Dominar todas as técnicas de preparo de café expresso"
            error={errors.whatYouWillLearn}
            required
            maxItems={10}
            helpText="Liste os principais aprendizados do curso"
          />
        </div>

        {/* Requisitos */}
        <div className="space-y-4 p-4 bg-accent/5 rounded-lg border-2 border-accent/20">
          <h3 className="font-semibold text-lg text-foreground">Requisitos</h3>
          <DynamicListField
            label="Pré-requisitos"
            items={requirements}
            onItemsChange={setRequirements}
            placeholder="Ex: Maior de 16 anos"
            error={errors.requirements}
            required
            maxItems={8}
            helpText="Liste os requisitos para participar"
          />
        </div>

        {/* Cronograma */}
        <div className="space-y-4 p-4 bg-accent/5 rounded-lg border-2 border-accent/20">
          <h3 className="font-semibold text-lg text-foreground">Cronograma</h3>

          <DynamicListField
            label="Períodos (Semanas)"
            items={scheduleWeeks}
            onItemsChange={handleScheduleWeeksChange}
            placeholder="Ex: Semana 1-2"
            error={errors.schedule}
            required
            maxItems={20}
            helpText="Defina os períodos do cronograma"
          />

          {scheduleWeeks.length > 0 && (
            <div className="space-y-3 mt-4">
              <label className="block text-sm font-medium text-foreground">
                Conteúdo de Cada Período
              </label>
              {scheduleWeeks.map((week, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <label className="text-sm text-foreground/70">{week}</label>
                  <textarea
                    value={scheduleContents[index] || ''}
                    onChange={(e) =>
                      handleScheduleContentChange(index, e.target.value)
                    }
                    placeholder="Descreva o conteúdo deste período..."
                    rows={2}
                    className="w-full px-4 py-2 border-2 border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Próximas Turmas */}
        <div className="space-y-4 p-4 bg-accent/5 rounded-lg border-2 border-accent/20">
          <h3 className="font-semibold text-lg text-foreground">
            Próximas Turmas
          </h3>
          <DynamicListField
            label="Datas das Turmas"
            items={nextDates}
            onItemsChange={setNextDates}
            placeholder="Ex: 15 de Novembro"
            error={errors.nextDates}
            required
            maxItems={10}
            helpText="Liste as próximas datas de início"
          />
        </div>

        {/* Features */}
        <div className="space-y-4 p-4 bg-accent/5 rounded-lg border-2 border-accent/20">
          <h3 className="font-semibold text-lg text-foreground">Inclusos</h3>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.certificate}
                onChange={(e) =>
                  setFormData({ ...formData, certificate: e.target.checked })
                }
                className="w-5 h-5 rounded border-2 border-accent text-accent focus:ring-accent"
              />
              <span className="text-sm font-medium text-foreground">
                Certificado de conclusão
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.materials}
                onChange={(e) =>
                  setFormData({ ...formData, materials: e.target.checked })
                }
                className="w-5 h-5 rounded border-2 border-accent text-accent focus:ring-accent"
              />
              <span className="text-sm font-medium text-foreground">
                Material didático incluso
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.support}
                onChange={(e) =>
                  setFormData({ ...formData, support: e.target.checked })
                }
                className="w-5 h-5 rounded border-2 border-accent text-accent focus:ring-accent"
              />
              <span className="text-sm font-medium text-foreground">
                Suporte pós-curso
              </span>
            </label>
          </div>
        </div>

        {errors.submit && (
          <div
            className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
            role="alert"
          >
            {errors.submit}
          </div>
        )}
      </div>
    </BaseFormModal>
  );
}
