'use client';

import { useState, useEffect } from 'react';
import Input from '@/components/UI/Input';
import { Workshop } from '@/types/admin.types';
import { createWorkshop, updateWorkshop } from '@/lib/admin.service';
import { uploadToCloudinary } from '@/lib/cloudinary-client';
import BaseFormModal from './BaseFormModal';
import ImageUploadField from './ImageUploadField';
import TextareaField from './TextareaField';
import DynamicListField from './DynamicListField';

interface WorkshopFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  workshop?: Workshop | null;
}

interface FormData {
  title: string;
  description: string;
  fullDescription: string;
  date: string;
  duration: string;
  level: string;
  category: string;
  instructor: string;
  instructorBio: string;
  price: string;
  maxParticipants: string;
  imageUrl: string;
  certificate: boolean;
  materials: boolean;
}

export default function WorkshopFormModal({
  isOpen,
  onClose,
  workshop,
}: WorkshopFormModalProps) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    fullDescription: '',
    date: '',
    duration: '',
    level: 'iniciante',
    category: '',
    instructor: '',
    instructorBio: '',
    price: '',
    maxParticipants: '',
    imageUrl: '',
    certificate: true,
    materials: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [topics, setTopics] = useState<string[]>([]);
  const [whatYouWillLearn, setWhatYouWillLearn] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [scheduleItems, setScheduleItems] = useState<string[]>([]);
  const [scheduleContents, setScheduleContents] = useState<string[]>([]);
  const [nextDates, setNextDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const parseDisplayDate = (dateStr: string): string => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    } catch {
      return '';
    }
    return '';
  };

  const formatDateForDisplay = (isoDate: string): string => {
    if (!isoDate || !/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return isoDate;
    try {
      const date = new Date(isoDate + 'T00:00:00');
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return isoDate;
    }
  };

  useEffect(() => {
    if (workshop) {
      setFormData({
        title: workshop.title,
        description: workshop.description,
        fullDescription: workshop.fullDescription || '',
        date: parseDisplayDate(workshop.date),
        duration: workshop.duration,
        level: workshop.level || 'iniciante',
        category: workshop.category || '',
        instructor: workshop.instructor,
        instructorBio: workshop.instructorBio || '',
        price: workshop.price,
        maxParticipants: workshop.maxParticipants?.toString() || '',
        imageUrl: workshop.imageUrl,
        certificate: workshop.certificate ?? true,
        materials: workshop.materials ?? true,
      });
      setImagePreview(workshop.imageUrl);
      setTopics(workshop.topics || []);
      setWhatYouWillLearn(workshop.whatYouWillLearn || []);
      setRequirements(workshop.requirements || []);
      
      const schedule = workshop.schedule || [];
      setScheduleItems(schedule.map((s) => s.week || ''));
      setScheduleContents(schedule.map((s) => s.content || ''));
      
      setNextDates(workshop.nextDates || []);
    } else {
      resetForm();
    }
  }, [workshop, isOpen]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      fullDescription: '',
      date: '',
      duration: '',
      level: 'iniciante',
      category: '',
      instructor: '',
      instructorBio: '',
      price: '',
      maxParticipants: '',
      imageUrl: '',
      certificate: true,
      materials: true,
    });
    setImageFile(null);
    setImagePreview('');
    setTopics([]);
    setWhatYouWillLearn([]);
    setRequirements([]);
    setScheduleItems([]);
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
    if (!formData.description.trim()) newErrors.description = 'Descrição curta é obrigatória';
    if (!formData.fullDescription.trim()) newErrors.fullDescription = 'Descrição completa é obrigatória';
    if (!formData.date.trim()) newErrors.date = 'Data é obrigatória';
    if (!formData.duration.trim()) newErrors.duration = 'Duração é obrigatória';
    if (!formData.level.trim()) newErrors.level = 'Nível é obrigatório';
    if (!formData.category.trim()) newErrors.category = 'Categoria é obrigatória';
    if (!formData.instructor.trim()) newErrors.instructor = 'Instrutor é obrigatório';
    if (!formData.instructorBio.trim()) newErrors.instructorBio = 'Biografia do instrutor é obrigatória';
    if (!formData.price.trim()) newErrors.price = 'Preço é obrigatório';
    if (!imagePreview) newErrors.image = 'Imagem é obrigatória';
    if (topics.length === 0) newErrors.topics = 'Adicione pelo menos um tópico';
    if (whatYouWillLearn.length === 0) newErrors.whatYouWillLearn = 'Adicione pelo menos um item de aprendizado';
    if (requirements.length === 0) newErrors.requirements = 'Adicione pelo menos um requisito';
    if (scheduleItems.length === 0 || scheduleContents.length === 0) {
      newErrors.schedule = 'Adicione pelo menos um item no cronograma';
    }
    if (nextDates.length === 0) newErrors.nextDates = 'Adicione pelo menos uma data';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleScheduleItemsChange = (items: string[]) => {
    setScheduleItems(items);
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
        imageUrl = await uploadToCloudinary(imageFile, 'workshops');
      }

      const schedule = scheduleItems.map((item, index) => ({
        week: item,
        content: scheduleContents[index] || '',
      }));

      const workshopData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        fullDescription: formData.fullDescription.trim(),
        date: formatDateForDisplay(formData.date.trim()),
        duration: formData.duration.trim(),
        level: formData.level.trim(),
        category: formData.category.trim(),
        instructor: formData.instructor.trim(),
        instructorBio: formData.instructorBio.trim(),
        price: formData.price.trim(),
        maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
        imageUrl,
        topics,
        whatYouWillLearn,
        requirements,
        schedule,
        nextDates,
        certificate: formData.certificate,
        materials: formData.materials,
      };

      if (workshop) {
        await updateWorkshop(workshop.id, workshopData);
      } else {
        await createWorkshop(workshopData);
      }

      onClose();
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar workshop:', error);
      setErrors({ submit: 'Erro ao salvar workshop. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseFormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={workshop ? 'Editar Workshop' : 'Adicionar Workshop'}
      loading={loading}
      submitText={workshop ? 'Atualizar' : 'Adicionar'}
      maxWidth="4xl"
    >
      <div className="space-y-6 max-h-[70vh] overflow-y-auto px-1">
        {/* Imagem */}
        <ImageUploadField
          label="Imagem do Workshop"
          imagePreview={imagePreview}
          onImageChange={handleImageChange}
          error={errors.image}
          required
          aspectRatio="video"
        />

        {/* Informações Básicas */}
        <div className="space-y-4 p-4 bg-accent/5 rounded-lg border-2 border-accent/20">
          <h3 className="font-semibold text-lg text-foreground">Informações Básicas</h3>

          <Input
            label="Título do Workshop"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={errors.title}
            required
            placeholder="Ex: Workshop: Expresso Perfeito"
          />

          <TextareaField
            id="workshop-description"
            label="Descrição Curta"
            value={formData.description}
            onChange={(value) => setFormData({ ...formData, description: value })}
            error={errors.description}
            required
            rows={2}
            placeholder="Breve descrição do workshop (aparece nos cards)"
            maxLength={200}
          />

          <TextareaField
            id="workshop-full-description"
            label="Descrição Completa"
            value={formData.fullDescription}
            onChange={(value) => setFormData({ ...formData, fullDescription: value })}
            error={errors.fullDescription}
            required
            rows={4}
            placeholder="Descrição detalhada do workshop (aparece na página do workshop)"
            maxLength={1000}
          />
        </div>

        {/* Detalhes do Workshop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Data Principal"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            error={errors.date}
            required
            helpText="Data de referência do workshop"
          />

          <Input
            label="Duração"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            error={errors.duration}
            required
            placeholder="Ex: 8 horas ou 1 dia"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nível <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              className="w-full px-4 py-2 border-2 border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              <option value="iniciante">Iniciante</option>
              <option value="intermediario">Intermediário</option>
              <option value="avancado">Avançado</option>
            </select>
            {errors.level && <p className="text-red-500 text-sm mt-1">{errors.level}</p>}
          </div>

          <Input
            label="Categoria"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            error={errors.category}
            required
            placeholder="Ex: barista, arte-latte, extracao"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Preço"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            error={errors.price}
            required
            placeholder="Ex: R$ 320,00"
          />

          <Input
            label="Vagas Máximas"
            type="number"
            min="1"
            value={formData.maxParticipants}
            onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
            placeholder="20"
            helpText="Deixe vazio para ilimitado"
          />
        </div>

        {/* Instrutor */}
        <div className="space-y-4 p-4 bg-accent/5 rounded-lg border-2 border-accent/20">
          <h3 className="font-semibold text-lg text-foreground">Informações do Instrutor</h3>

          <Input
            label="Nome do Instrutor"
            value={formData.instructor}
            onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
            error={errors.instructor}
            required
            placeholder="Ex: Chef Matteo Rossi"
          />

          <TextareaField
            id="workshop-instructor-bio"
            label="Biografia do Instrutor"
            value={formData.instructorBio}
            onChange={(value) => setFormData({ ...formData, instructorBio: value })}
            error={errors.instructorBio}
            required
            rows={3}
            placeholder="Experiência, certificações, prêmios..."
            maxLength={500}
          />
        </div>

        {/* Tópicos */}
        <div className="space-y-4 p-4 bg-accent/5 rounded-lg border-2 border-accent/20">
          <h3 className="font-semibold text-lg text-foreground">Tópicos do Workshop</h3>
          <DynamicListField
            label="Tópicos Principais"
            items={topics}
            onItemsChange={setTopics}
            placeholder="Ex: Calibração da máquina"
            error={errors.topics}
            required
            maxItems={10}
            helpText="Liste os principais tópicos abordados"
          />
        </div>

        {/* O que você vai aprender */}
        <div className="space-y-4 p-4 bg-accent/5 rounded-lg border-2 border-accent/20">
          <h3 className="font-semibold text-lg text-foreground">O Que Você Vai Aprender</h3>
          <DynamicListField
            label="Aprendizados"
            items={whatYouWillLearn}
            onItemsChange={setWhatYouWillLearn}
            placeholder="Ex: Calibrar máquina de expresso"
            error={errors.whatYouWillLearn}
            required
            maxItems={10}
            helpText="Liste os principais aprendizados do workshop"
          />
        </div>

        {/* Requisitos */}
        <div className="space-y-4 p-4 bg-accent/5 rounded-lg border-2 border-accent/20">
          <h3 className="font-semibold text-lg text-foreground">Requisitos</h3>
          <DynamicListField
            label="Pré-requisitos"
            items={requirements}
            onItemsChange={setRequirements}
            placeholder="Ex: Interesse em café expresso"
            error={errors.requirements}
            required
            maxItems={8}
            helpText="Liste os requisitos para participar"
          />
        </div>

        {/* Cronograma */}
        <div className="space-y-4 p-4 bg-accent/5 rounded-lg border-2 border-accent/20">
          <h3 className="font-semibold text-lg text-foreground">Cronograma do Dia</h3>
          
          <DynamicListField
            label="Períodos"
            items={scheduleItems}
            onItemsChange={handleScheduleItemsChange}
            placeholder="Ex: Manhã ou 09h - 12h"
            error={errors.schedule}
            required
            maxItems={10}
            helpText="Defina os períodos do workshop (ex: Manhã, Tarde)"
          />

          {scheduleItems.length > 0 && (
            <div className="space-y-3 mt-4">
              <label className="block text-sm font-medium text-foreground">
                Conteúdo de Cada Período
              </label>
              {scheduleItems.map((item, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <label className="text-sm text-foreground/70">{item}</label>
                  <textarea
                    value={scheduleContents[index] || ''}
                    onChange={(e) => handleScheduleContentChange(index, e.target.value)}
                    placeholder="Descreva o conteúdo deste período..."
                    rows={2}
                    className="w-full px-4 py-2 border-2 border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Próximas Datas */}
        <div className="space-y-4 p-4 bg-accent/5 rounded-lg border-2 border-accent/20">
          <h3 className="font-semibold text-lg text-foreground">Próximas Edições</h3>
          <DynamicListField
            label="Datas Disponíveis"
            items={nextDates}
            onItemsChange={setNextDates}
            placeholder="Ex: 18 de Novembro"
            error={errors.nextDates}
            required
            maxItems={10}
            helpText="Liste as próximas datas do workshop"
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
                onChange={(e) => setFormData({ ...formData, certificate: e.target.checked })}
                className="w-5 h-5 rounded border-2 border-accent text-accent focus:ring-accent"
              />
              <span className="text-sm font-medium text-foreground">Certificado de participação</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.materials}
                onChange={(e) => setFormData({ ...formData, materials: e.target.checked })}
                className="w-5 h-5 rounded border-2 border-accent text-accent focus:ring-accent"
              />
              <span className="text-sm font-medium text-foreground">Material didático incluso</span>
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
