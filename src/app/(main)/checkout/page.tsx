'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';
import { PageHero } from '@/components/Layout';
import {
  CreditCard,
  Lock,
  MapPin,
  User,
  ShoppingBag,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react';

type PaymentMethod = 'credit' | 'debit' | 'pix';
type ShippingMethod = 'standard' | 'express';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  // Form states
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit');
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('standard');
  
  // Personal info
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Address
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  // Payment
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Update page title
  useEffect(() => {
    document.title = 'Finalizar Compra | La Tazza';
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !orderComplete) {
      router.push('/carrinho');
    }
  }, [items, router, orderComplete]);

  // Pre-fill user data if authenticated
  useEffect(() => {
    if (user) {
      setFullName(user.displayName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const shippingCost = shippingMethod === 'express' ? 25.0 : 12.0;
  const total = totalPrice + shippingCost;

  // Format card number
  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const formatted = numbers.match(/.{1,4}/g)?.join(' ') || numbers;
    return formatted.substring(0, 19);
  };

  // Format expiry date
  const formatExpiry = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return `${numbers.substring(0, 2)}/${numbers.substring(2, 4)}`;
    }
    return numbers;
  };

  // Format phone
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  // Format CEP
  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2500));

    setIsProcessing(false);
    setOrderComplete(true);
    clearCart();
  };

  // Order complete screen
  if (orderComplete) {
    return (
      <main className="min-h-screen">
        <PageHero
          title="Pedido Confirmado!"
          description="Obrigado por comprar com a La Tazza"
        />
        <section className="w-full max-w-4xl mx-auto px-4 py-12">
          <div className="bg-accent/5 border-2 border-accent rounded-xl p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle size={48} className="text-green-600" />
              </div>
            </div>
            <h2 className="font-alumni text-3xl font-bold text-foreground mb-4">
              Seu pedido foi realizado com sucesso!
            </h2>
            <p className="text-foreground/70 mb-6">
              Enviamos um e-mail de confirmação para <strong>{email}</strong> com
              todos os detalhes do seu pedido e o código de rastreamento.
            </p>
            <div className="bg-background rounded-lg p-6 mb-6">
              <p className="text-sm text-foreground/60 mb-2">Número do Pedido</p>
              <p className="font-alumni text-2xl font-bold text-accent">
                #LT{Math.floor(Math.random() * 1000000)}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/" variant="ghost-fore">
                <span>Voltar ao Início</span>
              </Button>
              <Button href="/perfil" variant="accent">
                <span>Ver Meus Pedidos</span>
              </Button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <PageHero
        title="Finalizar Compra"
        description="Complete seu pedido de forma segura"
      />

      <section className="w-full max-w-7xl mx-auto px-4 py-12">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-foreground/70 hover:text-foreground mb-6 transition-colors focus:outline-none focus:ring-2 focus:ring-accent rounded px-2 py-1"
        >
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </button>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <div className="bg-background border-2 border-accent/20 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <User size={24} className="text-accent" />
                  <h2 className="font-alumni text-2xl font-bold text-foreground">
                    Informações Pessoais
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Nome Completo <span className="text-red-600">*</span>
                    </label>
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      placeholder="Seu nome completo"
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      E-mail <span className="text-red-600">*</span>
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="seu@email.com"
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Telefone <span className="text-red-600">*</span>
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(formatPhone(e.target.value))}
                      required
                      placeholder="(00) 00000-0000"
                      maxLength={15}
                      aria-required="true"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-background border-2 border-accent/20 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <MapPin size={24} className="text-accent" />
                  <h2 className="font-alumni text-2xl font-bold text-foreground">
                    Endereço de Entrega
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label
                      htmlFor="cep"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      CEP <span className="text-red-600">*</span>
                    </label>
                    <Input
                      id="cep"
                      type="text"
                      value={cep}
                      onChange={(e) => setCep(formatCep(e.target.value))}
                      required
                      placeholder="00000-000"
                      maxLength={9}
                      aria-required="true"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label
                      htmlFor="street"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Endereço <span className="text-red-600">*</span>
                    </label>
                    <Input
                      id="street"
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      required
                      placeholder="Rua, Avenida, etc."
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="number"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Número <span className="text-red-600">*</span>
                    </label>
                    <Input
                      id="number"
                      type="text"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      required
                      placeholder="123"
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="complement"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Complemento
                    </label>
                    <Input
                      id="complement"
                      type="text"
                      value={complement}
                      onChange={(e) => setComplement(e.target.value)}
                      placeholder="Apto, Bloco, etc."
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="neighborhood"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Bairro <span className="text-red-600">*</span>
                    </label>
                    <Input
                      id="neighborhood"
                      type="text"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      required
                      placeholder="Nome do bairro"
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Cidade <span className="text-red-600">*</span>
                    </label>
                    <Input
                      id="city"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      placeholder="Sua cidade"
                      aria-required="true"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Estado <span className="text-red-600">*</span>
                    </label>
                    <select
                      id="state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 border-2 border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground"
                      aria-required="true"
                    >
                      <option value="">Selecione um estado</option>
                      <option value="AC">Acre</option>
                      <option value="AL">Alagoas</option>
                      <option value="AP">Amapá</option>
                      <option value="AM">Amazonas</option>
                      <option value="BA">Bahia</option>
                      <option value="CE">Ceará</option>
                      <option value="DF">Distrito Federal</option>
                      <option value="ES">Espírito Santo</option>
                      <option value="GO">Goiás</option>
                      <option value="MA">Maranhão</option>
                      <option value="MT">Mato Grosso</option>
                      <option value="MS">Mato Grosso do Sul</option>
                      <option value="MG">Minas Gerais</option>
                      <option value="PA">Pará</option>
                      <option value="PB">Paraíba</option>
                      <option value="PR">Paraná</option>
                      <option value="PE">Pernambuco</option>
                      <option value="PI">Piauí</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="RN">Rio Grande do Norte</option>
                      <option value="RS">Rio Grande do Sul</option>
                      <option value="RO">Rondônia</option>
                      <option value="RR">Roraima</option>
                      <option value="SC">Santa Catarina</option>
                      <option value="SP">São Paulo</option>
                      <option value="SE">Sergipe</option>
                      <option value="TO">Tocantins</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Shipping Method */}
              <div className="bg-background border-2 border-accent/20 rounded-xl p-6">
                <h2 className="font-alumni text-2xl font-bold text-foreground mb-6">
                  Método de Envio
                </h2>
                <div className="space-y-3">
                  <label
                    className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      shippingMethod === 'standard'
                        ? 'border-accent bg-accent/5'
                        : 'border-accent/20 hover:border-accent/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        value="standard"
                        checked={shippingMethod === 'standard'}
                        onChange={(e) =>
                          setShippingMethod(e.target.value as ShippingMethod)
                        }
                        className="w-4 h-4 text-accent focus:ring-accent"
                      />
                      <div>
                        <p className="font-semibold text-foreground">
                          Envio Padrão
                        </p>
                        <p className="text-sm text-foreground/60">
                          Receba em até 7 dias úteis
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-foreground">R$ 12,00</span>
                  </label>
                  <label
                    className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      shippingMethod === 'express'
                        ? 'border-accent bg-accent/5'
                        : 'border-accent/20 hover:border-accent/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        value="express"
                        checked={shippingMethod === 'express'}
                        onChange={(e) =>
                          setShippingMethod(e.target.value as ShippingMethod)
                        }
                        className="w-4 h-4 text-accent focus:ring-accent"
                      />
                      <div>
                        <p className="font-semibold text-foreground">
                          Envio Expresso
                        </p>
                        <p className="text-sm text-foreground/60">
                          Receba em até 3 dias úteis
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-foreground">R$ 25,00</span>
                  </label>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-background border-2 border-accent/20 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard size={24} className="text-accent" />
                  <h2 className="font-alumni text-2xl font-bold text-foreground">
                    Forma de Pagamento
                  </h2>
                </div>

                {/* Payment method selection */}
                <div className="flex gap-3 mb-6">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit')}
                    className={`flex-1 py-3 px-4 border-2 rounded-lg font-medium transition-all ${
                      paymentMethod === 'credit'
                        ? 'border-accent bg-accent text-background'
                        : 'border-accent/20 text-foreground hover:border-accent/40'
                    }`}
                  >
                    Crédito
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('debit')}
                    className={`flex-1 py-3 px-4 border-2 rounded-lg font-medium transition-all ${
                      paymentMethod === 'debit'
                        ? 'border-accent bg-accent text-background'
                        : 'border-accent/20 text-foreground hover:border-accent/40'
                    }`}
                  >
                    Débito
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pix')}
                    className={`flex-1 py-3 px-4 border-2 rounded-lg font-medium transition-all ${
                      paymentMethod === 'pix'
                        ? 'border-accent bg-accent text-background'
                        : 'border-accent/20 text-foreground hover:border-accent/40'
                    }`}
                  >
                    PIX
                  </button>
                </div>

                {paymentMethod !== 'pix' ? (
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="cardNumber"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
                        Número do Cartão <span className="text-red-600">*</span>
                      </label>
                      <Input
                        id="cardNumber"
                        type="text"
                        value={cardNumber}
                        onChange={(e) =>
                          setCardNumber(formatCardNumber(e.target.value))
                        }
                        required
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                        aria-required="true"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="cardName"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
                        Nome no Cartão <span className="text-red-600">*</span>
                      </label>
                      <Input
                        id="cardName"
                        type="text"
                        value={cardName}
                        onChange={(e) =>
                          setCardName(e.target.value.toUpperCase())
                        }
                        required
                        placeholder="NOME COMO NO CARTÃO"
                        aria-required="true"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="cardExpiry"
                          className="block text-sm font-medium text-foreground mb-2"
                        >
                          Validade <span className="text-red-600">*</span>
                        </label>
                        <Input
                          id="cardExpiry"
                          type="text"
                          value={cardExpiry}
                          onChange={(e) =>
                            setCardExpiry(formatExpiry(e.target.value))
                          }
                          required
                          placeholder="MM/AA"
                          maxLength={5}
                          aria-required="true"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="cardCvv"
                          className="block text-sm font-medium text-foreground mb-2"
                        >
                          CVV <span className="text-red-600">*</span>
                        </label>
                        <Input
                          id="cardCvv"
                          type="text"
                          value={cardCvv}
                          onChange={(e) =>
                            setCardCvv(e.target.value.replace(/\D/g, ''))
                          }
                          required
                          placeholder="000"
                          maxLength={4}
                          aria-required="true"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-accent/5 border-2 border-accent/20 rounded-lg p-6 text-center">
                    <p className="text-foreground/70 mb-4">
                      Após confirmar o pedido, você receberá um QR Code PIX para
                      realizar o pagamento.
                    </p>
                    <p className="text-sm text-foreground/60">
                      O pedido será processado após a confirmação do pagamento.
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-2 mt-6 text-sm text-foreground/60">
                  <Lock size={16} />
                  <span>Pagamento 100% seguro e criptografado</span>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-background border-2 border-accent/20 rounded-xl p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-6">
                  <ShoppingBag size={24} className="text-accent" />
                  <h2 className="font-alumni text-2xl font-bold text-foreground">
                    Resumo do Pedido
                  </h2>
                </div>

                {/* Items */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-accent/10">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-foreground line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-xs text-foreground/60">
                          Qtd: {item.quantity}
                        </p>
                        <p className="text-sm font-bold text-foreground">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 pt-4 border-t-2 border-accent/20">
                  <div className="flex justify-between text-foreground/70">
                    <span>Subtotal:</span>
                    <span className="font-semibold">
                      R$ {totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-foreground/70">
                    <span>Frete:</span>
                    <span className="font-semibold">
                      R$ {shippingCost.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-foreground pt-3 border-t-2 border-accent/20">
                    <span className="font-alumni">Total:</span>
                    <span className="font-alumni text-accent">
                      R$ {total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="accent"
                  className="w-full mt-6"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
                      <span>Processando...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={20} />
                      <span>Finalizar Pedido</span>
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-foreground/60 mt-4">
                  Ao finalizar, você concorda com nossos{' '}
                  <a href="#" className="text-accent hover:underline">
                    Termos de Uso
                  </a>
                </p>
              </div>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}
