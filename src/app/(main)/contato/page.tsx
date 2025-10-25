'use client';

import { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Instagram,
  Facebook,
  Twitter,
} from 'lucide-react';

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: '',
  });

  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);

    // TODO: Implementar envio real do formulário para API
    setTimeout(() => {
      setEnviando(false);
      setEnviado(true);
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        assunto: '',
        mensagem: '',
      });

      setTimeout(() => setEnviado(false), 5000);
    }, 2000);
  };

  const assuntos = [
    'Dúvidas sobre Produtos',
    'Informações sobre Cursos',
    'Suporte Técnico',
    'Parceria Comercial',
    'Sugestões',
    'Reclamações',
    'Outros',
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="w-full bg-foreground text-background py-16 sm:py-20 md:py-24">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="font-alumni text-5xl sm:text-6xl md:text-7xl font-bold mb-4">
              Entre em Contato
            </h1>
            <p className="text-lg sm:text-xl text-background/80">
              Estamos aqui para ajudar! Envie sua mensagem e nossa equipe
              responderá o mais breve possível.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="w-full max-w-[1400px] mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form - 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-background border-2 border-accent/20 rounded-lg p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare size={28} className="text-accent" />
                <h2 className="font-alumni text-3xl sm:text-4xl font-bold text-foreground">
                  Envie sua Mensagem
                </h2>
              </div>

              {enviado && (
                <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">
                    ✓ Mensagem enviada com sucesso! Entraremos em contato em
                    breve.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nome e Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="nome"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-accent/20 bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                      placeholder="Seu nome"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      E-mail *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-accent/20 bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                {/* Telefone e Assunto */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="telefone"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Telefone
                    </label>
                    <input
                      type="tel"
                      id="telefone"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border-2 border-accent/20 bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                      placeholder="(00) 00000-0000"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="assunto"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Assunto *
                    </label>
                    <select
                      id="assunto"
                      name="assunto"
                      value={formData.assunto}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-accent/20 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                    >
                      <option value="">Selecione um assunto</option>
                      {assuntos.map((assunto) => (
                        <option key={assunto} value={assunto}>
                          {assunto}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Mensagem */}
                <div>
                  <label
                    htmlFor="mensagem"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Mensagem *
                  </label>
                  <textarea
                    id="mensagem"
                    name="mensagem"
                    value={formData.mensagem}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border-2 border-accent/20 bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all resize-none"
                    placeholder="Escreva sua mensagem aqui..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={enviando}
                  className="w-full sm:w-auto px-8 py-3 bg-accent text-background rounded-lg font-medium hover:bg-accent/90 transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {enviando ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Enviar Mensagem
                    </>
                  )}
                </button>

                <p className="text-sm text-foreground/60 mt-4">
                  * Campos obrigatórios
                </p>
              </form>
            </div>
          </div>

          {/* Contact Info - 1 column */}
          <div className="space-y-6">
            {/* Contact Cards */}
            <div className="bg-background border-2 border-accent/20 rounded-lg p-6">
              <h3 className="font-alumni text-2xl font-bold text-foreground mb-4">
                Informações de Contato
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail size={20} className="text-accent mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">E-mail</p>
                    <a
                      href="mailto:contato@latazza.com.br"
                      className="text-foreground/70 hover:text-accent transition-colors"
                    >
                      contato@latazza.com.br
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone size={20} className="text-accent mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Telefone</p>
                    <a
                      href="tel:+551140028922"
                      className="text-foreground/70 hover:text-accent transition-colors"
                    >
                      (11) 4002-8922
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin
                    size={20}
                    className="text-accent mt-1 flex-shrink-0"
                  />
                  <div>
                    <p className="font-medium text-foreground">Endereço</p>
                    <p className="text-foreground/70">
                      Rua do Café, 123
                      <br />
                      São Paulo - SP, 01234-567
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock size={20} className="text-accent mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">
                      Horário de Atendimento
                    </p>
                    <p className="text-foreground/70">
                      Segunda a Sexta: 9h às 18h
                      <br />
                      Sábado: 9h às 14h
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-background border-2 border-accent/20 rounded-lg p-6">
              <h3 className="font-alumni text-2xl font-bold text-foreground mb-4">
                Redes Sociais
              </h3>
              <p className="text-foreground/70 text-sm mb-4">
                Siga-nos nas redes sociais para ficar por dentro das novidades!
              </p>

              <div className="flex gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-accent/10 text-accent hover:bg-accent hover:text-background transition-all focus:outline-none focus:ring-2 focus:ring-accent"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-accent/10 text-accent hover:bg-accent hover:text-background transition-all focus:outline-none focus:ring-2 focus:ring-accent"
                  aria-label="Facebook"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-accent/10 text-accent hover:bg-accent hover:text-background transition-all focus:outline-none focus:ring-2 focus:ring-accent"
                  aria-label="Twitter"
                >
                  <Twitter size={20} />
                </a>
              </div>
            </div>

            {/* FAQ Quick Links */}
            <div className="bg-accent/5 border-2 border-accent/20 rounded-lg p-6">
              <h3 className="font-alumni text-xl font-bold text-foreground mb-3">
                Perguntas Frequentes
              </h3>
              <p className="text-foreground/70 text-sm mb-4">
                Antes de nos contatar, confira se sua dúvida já está respondida
                em nossa seção de FAQ.
              </p>
              <a
                href="/faq"
                className="inline-flex items-center gap-2 text-accent hover:underline font-medium"
              >
                Acessar FAQ
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="w-full bg-accent/5 py-12 sm:py-16">
        <div className="max-w-[1400px] mx-auto px-4">
          <h2 className="font-alumni text-3xl sm:text-4xl font-bold text-foreground mb-8 text-center">
            Nossa Localização
          </h2>

          <div className="bg-background border-2 border-accent/20 rounded-lg overflow-hidden">
            {/* TODO: Substituir por mapa real usando Google Maps ou Mapbox */}
            <div className="w-full h-96 bg-accent/10 flex items-center justify-center">
              <div className="text-center">
                <MapPin size={48} className="text-accent mx-auto mb-4" />
                <p className="text-foreground/70 font-medium">
                  Mapa interativo será carregado aqui
                </p>
                <p className="text-foreground/50 text-sm mt-2">
                  Rua do Café, 123 - São Paulo - SP
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
