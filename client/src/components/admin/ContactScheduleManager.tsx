
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Phone, Clock, MapPin, GripVertical, ChevronUp, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ContactScheduleManagerProps {
  contactSettings: any;
}

export function ContactScheduleManager({ contactSettings }: ContactScheduleManagerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("visibility");

  // Sensores para arrastar e soltar
  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Mutation para atualizar configurações
  const updateSettingsMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PUT", "/api/admin/contact-settings", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contact-settings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/contact-settings"] });
      toast({ title: "Configurações atualizadas com sucesso!" });
    },
  });

  // Schema de validação para item de contato
  const contactItemSchema = z.object({
    type: z.string().min(1, "Tipo é obrigatório"),
    title: z.string().min(1, "Título é obrigatório"),
    description: z.string().optional(),
    icon: z.string().min(1, "Ícone é obrigatório"),
    color: z.string().min(1, "Cor é obrigatória"),
    link: z.string().min(1, "Link é obrigatório"),
    isActive: z.boolean(),
    order: z.number().min(0),
  });

  type ContactItemForm = z.infer<typeof contactItemSchema>;

  const form = useForm<ContactItemForm>({
    resolver: zodResolver(contactItemSchema),
    defaultValues: {
      type: "whatsapp",
      title: "",
      description: "",
      icon: "FaWhatsapp",
      color: "#25D366",
      link: "",
      isActive: true,
      order: 0,
    },
  });

  // Função para alternar visibilidade de horários
  const toggleScheduleVisibility = (isActive: boolean) => {
    const newSettings = {
      ...contactSettings,
      schedule_info: {
        ...contactSettings.schedule_info,
        isActive: isActive
      }
    };
    updateSettingsMutation.mutate(newSettings);
  };

  // Função para alternar visibilidade de localização
  const toggleLocationVisibility = (isActive: boolean) => {
    const newSettings = {
      ...contactSettings,
      location_info: {
        ...contactSettings.location_info,
        isActive: isActive
      }
    };
    updateSettingsMutation.mutate(newSettings);
  };

  // Função para atualizar horários
  const updateScheduleInfo = (data: any) => {
    const newSettings = {
      ...contactSettings,
      schedule_info: {
        ...contactSettings.schedule_info,
        ...data
      }
    };
    updateSettingsMutation.mutate(newSettings);
  };

  // Função para atualizar localização
  const updateLocationInfo = (data: any) => {
    const newSettings = {
      ...contactSettings,
      location_info: {
        ...contactSettings.location_info,
        ...data
      }
    };
    updateSettingsMutation.mutate(newSettings);
  };

  // Função para arrastar e soltar itens de contato
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id && over) {
      const contactItems = contactSettings?.contact_items || [];
      const oldIndex = contactItems.findIndex((item: any) => item.id === active.id);
      const newIndex = contactItems.findIndex((item: any) => item.id === over.id);
      
      const newItems = arrayMove(contactItems, oldIndex, newIndex).map((item: any, index: number) => ({
        ...item,
        order: index
      }));
      
      const newSettings = {
        ...contactSettings,
        contact_items: newItems
      };
      
      updateSettingsMutation.mutate(newSettings);
    }
  };

  // Função para adicionar/editar item de contato
  const onSubmitContactItem = (data: ContactItemForm) => {
    const contactItems = contactSettings?.contact_items || [];
    let newItems;
    
    if (editingItem) {
      newItems = contactItems.map((item: any) => 
        item.id === editingItem.id ? { ...item, ...data } : item
      );
    } else {
      const newId = Math.max(...contactItems.map((c: any) => c.id), 0) + 1;
      const newItem = {
        id: newId,
        ...data,
        order: contactItems.length
      };
      newItems = [...contactItems, newItem];
    }
    
    const newSettings = {
      ...contactSettings,
      contact_items: newItems
    };
    
    updateSettingsMutation.mutate(newSettings);
    setIsDialogOpen(false);
    setEditingItem(null);
    form.reset();
  };

  // Função para deletar item de contato
  const deleteContactItem = (id: number) => {
    const contactItems = contactSettings?.contact_items || [];
    const newItems = contactItems
      .filter((item: any) => item.id !== id)
      .map((item: any, index: number) => ({ ...item, order: index }));
    
    const newSettings = {
      ...contactSettings,
      contact_items: newItems
    };
    
    updateSettingsMutation.mutate(newSettings);
  };

  // Abrir dialog para editar
  const openEditDialog = (item: any) => {
    setEditingItem(item);
    form.setValue("type", item.type || "whatsapp");
    form.setValue("title", item.title || "");
    form.setValue("description", item.description || "");
    form.setValue("icon", item.icon || "FaWhatsapp");
    form.setValue("color", item.color || "#25D366");
    form.setValue("link", item.link || "");
    form.setValue("isActive", item.isActive ?? true);
    form.setValue("order", item.order || 0);
    setIsDialogOpen(true);
  };

  // Abrir dialog para criar
  const openCreateDialog = () => {
    setEditingItem(null);
    form.reset();
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Tabs de navegação */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab("visibility")}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
            activeTab === "visibility" 
              ? "bg-white text-gray-900 shadow-sm" 
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          👁️ Visibilidade
        </button>
        <button
          onClick={() => setActiveTab("schedule")}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
            activeTab === "schedule" 
              ? "bg-white text-gray-900 shadow-sm" 
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          🕒 Horários
        </button>
        <button
          onClick={() => setActiveTab("location")}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
            activeTab === "location" 
              ? "bg-white text-gray-900 shadow-sm" 
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          📍 Localização
        </button>
        <button
          onClick={() => setActiveTab("contact")}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
            activeTab === "contact" 
              ? "bg-white text-gray-900 shadow-sm" 
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          📱 Botões de Contato
        </button>
      </div>

      {/* Tab: Controle de Visibilidade */}
      {activeTab === "visibility" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">👁️</span>
              Controle de Visibilidade
            </CardTitle>
            <CardDescription>
              Configure quais elementos aparecem no card de contato/horários. Se ambos forem desativados, o card não aparecerá no site.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                ⚠️ <strong>Importante:</strong> Se tanto os horários quanto a localização forem desativados, 
                o card lateral direito da seção de contato ficará oculto para evitar espaços vazios.
              </p>
            </div>

            <div className="grid gap-4">
              {/* Controle de Horários */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Horários de Atendimento</h4>
                    <p className="text-sm text-gray-600">
                      {contactSettings?.schedule_info?.isActive !== false ? "Visível no site" : "Oculto do site"}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={contactSettings?.schedule_info?.isActive !== false}
                  onCheckedChange={toggleScheduleVisibility}
                />
              </div>

              {/* Controle de Localização */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Localização</h4>
                    <p className="text-sm text-gray-600">
                      {contactSettings?.location_info?.isActive !== false ? "Visível no site" : "Oculto do site"}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={contactSettings?.location_info?.isActive !== false}
                  onCheckedChange={toggleLocationVisibility}
                />
              </div>
            </div>

            {/* Status atual */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Status Atual do Card:</h4>
              {contactSettings?.schedule_info?.isActive !== false || contactSettings?.location_info?.isActive !== false ? (
                <p className="text-sm text-blue-800">
                  ✅ <strong>Card visível</strong> - Pelo menos um elemento está ativo
                </p>
              ) : (
                <p className="text-sm text-blue-800">
                  ❌ <strong>Card oculto</strong> - Nenhum elemento está ativo
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab: Configuração de Horários */}
      {activeTab === "schedule" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Configurar Horários de Atendimento
            </CardTitle>
            <CardDescription>
              Configure os horários que aparecem na seção de contato
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScheduleForm 
              scheduleInfo={contactSettings?.schedule_info || {}}
              onUpdate={updateScheduleInfo}
              isLoading={updateSettingsMutation.isPending}
            />
          </CardContent>
        </Card>
      )}

      {/* Tab: Configuração de Localização */}
      {activeTab === "location" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Configurar Localização
            </CardTitle>
            <CardDescription>
              Configure a localização que aparece na seção de contato
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LocationForm 
              locationInfo={contactSettings?.location_info || {}}
              onUpdate={updateLocationInfo}
              isLoading={updateSettingsMutation.isPending}
            />
          </CardContent>
        </Card>
      )}

      {/* Tab: Botões de Contato */}
      {activeTab === "contact" && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Gerenciar Botões de Contato
                </CardTitle>
                <CardDescription>
                  Configure os botões de contato (WhatsApp, Instagram, Email, etc.)
                </CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openCreateDialog}>
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Botão
                  </Button>
                </DialogTrigger>
                <ContactItemDialog
                  isOpen={isDialogOpen}
                  onClose={() => setIsDialogOpen(false)}
                  form={form}
                  onSubmit={onSubmitContactItem}
                  editingItem={editingItem}
                  isLoading={updateSettingsMutation.isPending}
                />
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <ContactItemsList
              items={contactSettings?.contact_items || []}
              onEdit={openEditDialog}
              onDelete={deleteContactItem}
              onDragEnd={handleDragEnd}
              sensors={sensors}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Componente para formulário de horários
function ScheduleForm({ scheduleInfo, onUpdate, isLoading }: {
  scheduleInfo: any;
  onUpdate: (data: any) => void;
  isLoading: boolean;
}) {
  const scheduleSchema = z.object({
    weekdays: z.string().min(1, "Horário de segunda à sexta é obrigatório"),
    saturday: z.string().min(1, "Horário de sábado é obrigatório"),
    sunday: z.string().min(1, "Horário de domingo é obrigatório"),
    additional_info: z.string().optional(),
  });

  type ScheduleForm = z.infer<typeof scheduleSchema>;

  const form = useForm<ScheduleForm>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      weekdays: scheduleInfo.weekdays || "Segunda à Sexta: 8h às 18h",
      saturday: scheduleInfo.saturday || "Sábado: 8h às 12h",
      sunday: scheduleInfo.sunday || "Domingo: Fechado",
      additional_info: scheduleInfo.additional_info || "",
    },
  });

  const onSubmit = (data: ScheduleForm) => {
    onUpdate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="weekdays"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Segunda à Sexta</FormLabel>
              <FormControl>
                <Input placeholder="Segunda à Sexta: 8h às 18h" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="saturday"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sábado</FormLabel>
              <FormControl>
                <Input placeholder="Sábado: 8h às 12h" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sunday"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Domingo</FormLabel>
              <FormControl>
                <Input placeholder="Domingo: Fechado" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="additional_info"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Informações Adicionais (Opcional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Horários flexíveis disponíveis" rows={2} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar Horários"}
        </Button>
      </form>
    </Form>
  );
}

// Componente para formulário de localização
function LocationForm({ locationInfo, onUpdate, isLoading }: {
  locationInfo: any;
  onUpdate: (data: any) => void;
  isLoading: boolean;
}) {
  const locationSchema = z.object({
    city: z.string().min(1, "Cidade é obrigatória"),
    maps_link: z.string().url("Link do Google Maps deve ser uma URL válida").optional(),
  });

  type LocationForm = z.infer<typeof locationSchema>;

  const form = useForm<LocationForm>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      city: locationInfo.city || "Campo Mourão, Paraná",
      maps_link: locationInfo.maps_link || "",
    },
  });

  const onSubmit = (data: LocationForm) => {
    onUpdate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cidade/Localização</FormLabel>
              <FormControl>
                <Input placeholder="Campo Mourão, Paraná" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="maps_link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link do Google Maps (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="https://maps.google.com/..." {...field} />
              </FormControl>
              <FormDescription>
                Se preenchido, a localização será clicável no site
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar Localização"}
        </Button>
      </form>
    </Form>
  );
}

// Componente para dialog de item de contato
function ContactItemDialog({ isOpen, onClose, form, onSubmit, editingItem, isLoading }: {
  isOpen: boolean;
  onClose: () => void;
  form: any;
  onSubmit: (data: any) => void;
  editingItem: any;
  isLoading: boolean;
}) {
  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>
          {editingItem ? "Editar Botão de Contato" : "Novo Botão de Contato"}
        </DialogTitle>
        <DialogDescription>
          Configure um botão de contato para a seção
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Telefone</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ícone</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="FaWhatsapp">WhatsApp</SelectItem>
                      <SelectItem value="FaInstagram">Instagram</SelectItem>
                      <SelectItem value="Mail">Email</SelectItem>
                      <SelectItem value="Phone">Telefone</SelectItem>
                      <SelectItem value="FaLinkedin">LinkedIn</SelectItem>
                      <SelectItem value="FaFacebook">Facebook</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input placeholder="WhatsApp" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição (Opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="(44) 998-362-704" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor</FormLabel>
                  <div className="flex items-center space-x-2">
                    <FormControl>
                      <Input type="color" className="w-12 h-10" {...field} />
                    </FormControl>
                    <FormControl>
                      <Input placeholder="#25D366" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ordem</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link</FormLabel>
                <FormControl>
                  <Input placeholder="https://wa.me/5544998362704" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Ativo</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Exibir este botão no site
                  </div>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {editingItem ? "Atualizar" : "Criar"}
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}

// Componente para lista de itens de contato
function ContactItemsList({ items, onEdit, onDelete, onDragEnd, sensors }: {
  items: any[];
  onEdit: (item: any) => void;
  onDelete: (id: number) => void;
  onDragEnd: (event: any) => void;
  sensors: any;
}) {
  return (
    <div className="space-y-4">
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          💡 <strong>Dica:</strong> Arraste e solte os botões para reordenar sua exibição no site
        </p>
      </div>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {items
              .sort((a, b) => a.order - b.order)
              .map((item) => (
                <SortableContactItem 
                  key={item.id} 
                  item={item}
                  onEdit={() => onEdit(item)}
                  onDelete={() => onDelete(item.id)}
                />
              ))}
          </div>
        </SortableContext>
      </DndContext>
      
      {items.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Phone className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Nenhum botão de contato cadastrado ainda.</p>
          <p className="text-sm">Clique em "Novo Botão" para começar.</p>
        </div>
      )}
    </div>
  );
}

// Componente para item de contato arrastável
function SortableContactItem({ item, onEdit, onDelete }: {
  item: any;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card ref={setNodeRef} style={style} className="p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3 flex-1">
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white"
            style={{ backgroundColor: item.color }}
          >
            <span className="text-sm font-semibold">
              {item.icon === 'FaWhatsapp' && '📱'}
              {item.icon === 'FaInstagram' && '📷'}
              {item.icon === 'Mail' && '✉️'}
              {item.icon === 'Phone' && '📞'}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold">{item.title}</h4>
              <Badge variant={item.isActive ? "default" : "secondary"} className="text-xs">
                {item.isActive ? "Ativo" : "Inativo"}
              </Badge>
            </div>
            {item.description && (
              <p className="text-sm text-gray-600">{item.description}</p>
            )}
            <p className="text-xs text-gray-400">Ordem: {item.order}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="destructive" size="sm" onClick={onDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
