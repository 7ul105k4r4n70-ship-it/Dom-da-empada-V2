import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Search, 
  Bell, 
  UserCircle, 
  Edit2, 
  Ban, 
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  MoreVertical
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { db, collection, onSnapshot, query, handleFirestoreError, OperationType } from '@/firebase';
import { type User } from '@/types';

export function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
      setUsers(usersData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'users');
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-on-surface font-headline">Gestão de Usuários</h2>
          <p className="text-on-surface-variant font-body">Administre os acessos e permissões da equipe operacional.</p>
        </div>
        <button className="flex items-center gap-2 primary-gradient text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
          <UserPlus className="w-5 h-5" />
          Novo Usuário
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Usuários', value: users.length.toString(), color: 'border-primary' },
          { label: 'Ativos Agora', value: users.filter(u => u.status === 'Ativo').length.toString(), color: 'border-secondary' },
          { label: 'Coordenadores', value: users.filter(u => u.role === 'coordenador').length.toString(), color: 'border-tertiary' },
          { label: 'Analistas', value: users.filter(u => u.role === 'analista').length.toString(), color: 'border-primary-container' },
        ].map((stat, i) => (
          <div key={i} className={cn("bg-white p-6 rounded-xl border-l-4 shadow-sm", stat.color)}>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{stat.label}</p>
            <p className="text-4xl font-black mt-2 font-headline">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-on-surface-variant">
              <th className="px-6 py-4 font-headline text-xs font-bold uppercase tracking-wider">Usuário</th>
              <th className="px-6 py-4 font-headline text-xs font-bold uppercase tracking-wider">Papel</th>
              <th className="px-6 py-4 font-headline text-xs font-bold uppercase tracking-wider">Região</th>
              <th className="px-6 py-4 font-headline text-xs font-bold uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 font-headline text-xs font-bold uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-sm text-on-surface-variant">Carregando usuários...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-sm text-on-surface-variant">Nenhum usuário encontrado.</td>
              </tr>
            ) : users.map((user, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={user.photoUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop"} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-bold text-sm">{user.name}</p>
                      <p className="text-xs text-on-surface-variant">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase",
                    user.role === 'admin' ? "bg-red-100 text-red-900" : 
                    user.role === 'coordenador' ? "bg-amber-100 text-amber-900" : "bg-slate-100 text-slate-700"
                  )}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-tertiary">{user.region}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", user.status === 'Ativo' ? "bg-emerald-500" : "bg-slate-300")}></div>
                    <span className="text-xs font-medium">{user.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-slate-200 rounded-lg text-on-surface-variant transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className={cn(
                      "p-2 hover:bg-slate-200 rounded-lg transition-colors",
                      user.status === 'Ativo' ? "text-red-600" : "text-emerald-600"
                    )}>
                      {user.status === 'Ativo' ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-6 py-4 bg-slate-50 flex justify-between items-center border-t border-slate-100">
          <p className="text-xs font-medium text-on-surface-variant">Exibindo {users.length} de {users.length} usuários</p>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg bg-white border border-slate-200 text-on-surface-variant hover:bg-slate-100 transition-colors disabled:opacity-50" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg bg-white border border-slate-200 text-on-surface-variant hover:bg-slate-100 transition-colors disabled:opacity-50" disabled>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
