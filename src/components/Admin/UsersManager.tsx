'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Shield,
  ShieldOff,
  Trash2,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  LogIn,
  AlertTriangle,
} from 'lucide-react';
import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';
import DeleteConfirmModal from './DeleteConfirmModal';
import UserActionModal from './UserActionModal';
import { AdminUser } from '@/types/admin.types';
import {
  getUsers,
  deleteUser,
  toggleUserAdmin,
  toggleUserStatus,
} from '@/lib/admin.service';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import Skeleton from '@/components/UI/Skeleton';

export default function UsersManager() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [actionType, setActionType] = useState<
    'promote' | 'demote' | 'disable' | 'enable' | null
  >(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(
        (user) =>
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.uid.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (user: AdminUser) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    try {
      setActionLoading(true);
      await deleteUser(selectedUser.uid);
      await loadUsers();
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      alert(error instanceof Error ? error.message : 'Erro ao deletar usuário');
    } finally {
      setActionLoading(false);
    }
  };

  const handleActionClick = (
    user: AdminUser,
    action: 'promote' | 'demote' | 'disable' | 'enable'
  ) => {
    setSelectedUser(user);
    setActionType(action);
    setIsActionModalOpen(true);
  };

  const handleActionConfirm = async () => {
    if (!selectedUser || !actionType) return;

    try {
      setActionLoading(true);

      if (actionType === 'promote' || actionType === 'demote') {
        await toggleUserAdmin(selectedUser.uid, actionType === 'promote');
      } else {
        await toggleUserStatus(selectedUser.uid, actionType === 'disable');
      }

      await loadUsers();
      setIsActionModalOpen(false);
      setSelectedUser(null);
      setActionType(null);
    } catch (error) {
      console.error('Erro ao executar ação:', error);
      alert(error instanceof Error ? error.message : 'Erro ao executar ação');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const isCurrentUser = (uid: string) => currentUser?.uid === uid;

  if (loading) {
    return (
      <div>
        {/* Search Skeleton */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Skeleton
              variant="rectangular"
              height={40}
              className="rounded-md"
            />
          </div>
        </div>

        {/* Stats Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-background border-2 border-foreground rounded-lg p-4">
            <Skeleton variant="text" height={14} className="mb-2" />
            <Skeleton variant="text" height={36} />
          </div>
          <div className="bg-background border-2 border-accent rounded-lg p-4">
            <Skeleton variant="text" height={14} className="mb-2" />
            <Skeleton variant="text" height={36} />
          </div>
          <div className="bg-background border-2 border-red-600 rounded-lg p-4">
            <Skeleton variant="text" height={14} className="mb-2" />
            <Skeleton variant="text" height={36} />
          </div>
        </div>

        {/* Users Cards Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <article
              key={index}
              className="border-2 rounded-lg overflow-hidden bg-background flex flex-col"
            >
              <div className="p-4">
                {/* Header com Avatar e Tags */}
                <div className="flex items-start gap-3 mb-3">
                  {/* Avatar Skeleton */}
                  <Skeleton variant="circular" width={56} height={56} />

                  {/* Name e Tags */}
                  <div className="flex-1 min-w-0">
                    <Skeleton variant="text" height={20} className="mb-2" />
                    <div className="flex gap-1">
                      <Skeleton variant="rectangular" width={60} height={20} />
                      <Skeleton variant="rectangular" width={50} height={20} />
                    </div>
                  </div>
                </div>

                {/* Info Skeleton */}
                <div className="space-y-1 mb-3 border-t border-foreground/10 pt-3">
                  <Skeleton variant="text" height={16} />
                  <Skeleton variant="text" height={16} />
                  <Skeleton variant="text" height={16} />
                </div>

                {/* Actions Skeleton */}
                <div className="flex gap-2 flex-wrap">
                  <Skeleton
                    variant="rectangular"
                    height={32}
                    className="flex-1"
                  />
                  <Skeleton
                    variant="rectangular"
                    height={32}
                    className="flex-1"
                  />
                  <Skeleton
                    variant="rectangular"
                    height={32}
                    className="flex-1"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
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
              aria-hidden="true"
            />
            <Input
              type="text"
              placeholder="Buscar usuários por nome, e-mail ou ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              aria-label="Buscar usuários"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-background border-2 border-foreground rounded-lg p-4">
          <p className="text-sm text-foreground/60 mb-1">Total de Usuários</p>
          <p className="text-3xl font-alumni font-bold text-foreground">
            {users.length}
          </p>
        </div>
        <div className="bg-background border-2 border-accent rounded-lg p-4">
          <p className="text-sm text-foreground/60 mb-1">Administradores</p>
          <p className="text-3xl font-alumni font-bold text-accent">
            {users.filter((u) => u.isAdmin).length}
          </p>
        </div>
        <div className="bg-background border-2 border-red-600 rounded-lg p-4">
          <p className="text-sm text-foreground/60 mb-1">Desativados</p>
          <p className="text-3xl font-alumni font-bold text-red-600">
            {users.filter((u) => u.disabled).length}
          </p>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-12 bg-background border-2 border-dashed border-foreground/20 rounded-lg">
          <p className="text-foreground/60">Nenhum usuário encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredUsers.map((user) => (
            <article
              key={user.uid}
              className={`border-2 rounded-lg overflow-hidden bg-background transition-all flex flex-col ${
                user.disabled
                  ? 'border-red-600 opacity-60'
                  : isCurrentUser(user.uid)
                    ? 'border-accent'
                    : 'border-foreground'
              }`}
            >
              <div className="p-4">
                {/* Header com Avatar e Tags */}
                <div className="flex items-start gap-3 mb-3">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-foreground/20">
                      {user.photoURL ? (
                        <Image
                          src={user.photoURL}
                          alt={user.displayName || 'Usuário'}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      ) : (
                        <div className="w-full h-full bg-foreground/10 flex items-center justify-center">
                          <span className="text-xl font-bold text-foreground/40">
                            {(user.displayName ||
                              user.email ||
                              'U')[0].toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Name e Tags */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-alumni font-bold text-foreground text-xl truncate">
                      {user.displayName || 'Sem nome'}
                    </h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {isCurrentUser(user.uid) && (
                        <span className="text-sm font-medium text-accent bg-accent/10 px-2 py-1 rounded">
                          Você
                        </span>
                      )}
                      {user.isAdmin && (
                        <span className="text-sm font-medium text-blue-600 bg-blue-600/10 px-2 py-1 rounded flex items-center gap-1">
                          <Shield size={12} />
                          Admin
                        </span>
                      )}
                      {user.disabled && (
                        <span className="text-sm font-medium text-red-600 bg-red-600/10 px-2 py-1 rounded flex items-center gap-1">
                          <AlertTriangle size={12} />
                          Inativo
                        </span>
                      )}
                      {!user.emailVerified && (
                        <span className="text-sm font-medium text-orange-600 bg-orange-600/10 px-2 py-1 rounded">
                          Não verificado
                        </span>
                      )}
                      {user.providerData?.some(
                        (provider) => provider.providerId === 'google.com'
                      ) && (
                        <span className="text-sm font-medium text-green-600 bg-green-600/10 px-2 py-1 rounded flex items-center gap-1">
                          <svg
                            className="w-3 h-3"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                          </svg>
                          Google
                        </span>
                      )}
                      {user.emailVerified && (
                        <span className="text-sm font-medium text-green-600 bg-green-600/10 px-2 py-1 rounded flex items-center gap-1">
                          <UserCheck size={12} />
                          Verificado
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Info Compacta */}
                <div className="space-y-1 text-sm text-foreground/70 mb-3 border-t border-foreground/10 pt-3">
                  <div className="flex items-center gap-2 truncate">
                    <Mail
                      size={14}
                      className="flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="truncate">{user.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar
                      size={14}
                      className="flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span>Criado: {formatDate(user.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LogIn
                      size={14}
                      className="flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span>Login: {formatDate(user.lastSignInTime)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-3 flex-wrap">
                  {!user.isAdmin ? (
                    <Button
                      onClick={() => handleActionClick(user, 'promote')}
                      variant="accent"
                      disabled={isCurrentUser(user.uid)}
                      className="text-sm py-2 px-3 h-auto flex-1 min-w-max"
                    >
                      <Shield size={16} />
                      <span className="hidden sm:inline ml-1">Promover</span>
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleActionClick(user, 'demote')}
                      variant="accent"
                      disabled={isCurrentUser(user.uid)}
                      className="text-sm py-2 px-3 h-auto flex-1 min-w-max"
                    >
                      <ShieldOff size={16} />
                      <span className="hidden sm:inline ml-1">Remover</span>
                    </Button>
                  )}

                  {!user.disabled ? (
                    <Button
                      onClick={() => handleActionClick(user, 'disable')}
                      variant="accent"
                      disabled={isCurrentUser(user.uid)}
                      className="text-sm py-2 px-3 h-auto flex-1 min-w-max"
                    >
                      <UserX size={16} />
                      <span className="hidden sm:inline ml-1">Desativar</span>
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleActionClick(user, 'enable')}
                      variant="accent"
                      className="text-sm py-2 px-3 h-auto flex-1 min-w-max"
                    >
                      <UserCheck size={16} />
                      <span className="hidden sm:inline ml-1">Ativar</span>
                    </Button>
                  )}

                  <Button
                    onClick={() => handleDeleteClick(user)}
                    variant="danger"
                    disabled={isCurrentUser(user.uid)}
                    className="text-sm py-2 px-3 h-auto flex-1 min-w-max"
                  >
                    <Trash2 size={16} />
                    <span className="hidden sm:inline ml-1">Excluir</span>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={
          selectedUser?.displayName || selectedUser?.email || 'este usuário'
        }
        itemType="usuário"
        loading={actionLoading}
      />

      <UserActionModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        onConfirm={handleActionConfirm}
        user={selectedUser}
        actionType={actionType}
        loading={actionLoading}
      />
    </div>
  );
}
