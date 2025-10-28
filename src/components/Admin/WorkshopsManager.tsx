'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, Calendar, Users } from 'lucide-react';
import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import WorkshopFormModal from './WorkshopFormModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { Workshop } from '@/types/admin.types';
import { getWorkshops, deleteWorkshop } from '@/lib/admin.service';
import Image from 'next/image';

export default function WorkshopsManager() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [filteredWorkshops, setFilteredWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [workshopToDelete, setWorkshopToDelete] = useState<Workshop | null>(null);

  useEffect(() => {
    loadWorkshops();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = workshops.filter(
        (workshop) =>
          workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          workshop.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredWorkshops(filtered);
    } else {
      setFilteredWorkshops(workshops);
    }
  }, [searchTerm, workshops]);

  const loadWorkshops = async () => {
    try {
      setLoading(true);
      const data = await getWorkshops();
      setWorkshops(data);
      setFilteredWorkshops(data);
    } catch (error) {
      console.error('Erro ao carregar workshops:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedWorkshop(null);
    setIsModalOpen(true);
  };

  const handleEdit = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (workshop: Workshop) => {
    setWorkshopToDelete(workshop);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!workshopToDelete) return;

    try {
      await deleteWorkshop(workshopToDelete.id);
      await loadWorkshops();
      setIsDeleteModalOpen(false);
      setWorkshopToDelete(null);
    } catch (error) {
      console.error('Erro ao deletar workshop:', error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedWorkshop(null);
    loadWorkshops();
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
              className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40"
              size={20}
            />
            <Input
              type="text"
              placeholder="Buscar workshops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Button onClick={handleAdd} variant="accent">
          <Plus size={20} />
          <span>Adicionar Workshop</span>
        </Button>
      </div>

      {filteredWorkshops.length === 0 ? (
        <div className="text-center py-12 bg-background border-2 border-dashed border-foreground/20 rounded-lg">
          <p className="text-foreground/60 mb-4">Nenhum workshop encontrado</p>
          <Button onClick={handleAdd} variant="accent">
            <Plus size={20} />
            <span>Adicionar Primeiro Workshop</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkshops.map((workshop) => (
            <article
              key={workshop.id}
              className="border-2 border-foreground rounded-lg overflow-hidden bg-background hover:shadow-lg transition-shadow"
            >
              <div className="relative w-full h-48">
                <Image
                  src={workshop.imageUrl}
                  alt={workshop.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-4">
                <h3 className="font-alumni text-2xl font-bold text-foreground mb-2">
                  {workshop.title}
                </h3>
                <p className="text-sm text-foreground/70 mb-3 line-clamp-2">
                  {workshop.description}
                </p>
                <div className="space-y-2 mb-3 text-sm text-foreground/70">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-accent" />
                    <span>{workshop.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-accent" />
                    <span>
                      Instrutor: <strong>{workshop.instructor}</strong>
                    </span>
                  </div>
                  {workshop.maxParticipants && (
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-accent" />
                      <span>
                        Vagas: {workshop.currentParticipants || 0}/{workshop.maxParticipants}
                      </span>
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  <span className="font-alumni text-2xl font-bold text-accent">
                    {workshop.price}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(workshop)}
                    variant="ghost-accent"
                    className="flex-1"
                  >
                    <Pencil size={18} />
                    <span>Editar</span>
                  </Button>
                  <Button
                    onClick={() => handleDeleteClick(workshop)}
                    variant="danger"
                    className="flex-1"
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

      <WorkshopFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        workshop={selectedWorkshop}
      />
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={workshopToDelete?.title || ''}
        itemType="workshop"
      />
    </div>
  );
}
