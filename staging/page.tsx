import Image from "next/image";
import Link from "next/link";
import { Countdown } from "@/components/Countdown";
import { GallerySection } from "@/components/GallerySection";
import { RsvpButton } from "@/components/RsvpButton";
import { WEDDING } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";
import type { GalleryPhoto } from "@/lib/types";

const lodging = [
  {
    name: "Pousada Freschezza",
    note: "Parceira do Mirante Juruá. Ideal para quem quer ficar bem perto do local.",
    link: "https://www.google.com/maps/search/?api=1&query=Pousada+Freschezza+Mairipor%C3%A3",
  },
  {
    name: "Hospedagens em Mairiporã",
    note: "Pousadas e casas na Serra da Cantareira — confira disponibilidade para 29–31/01/2027.",
    link: "https://www.booking.com/searchresults.pt-br.html?ss=Mairipor%C3%A3",
  },
  {
    name: "Airbnb na região",
    note: "Casas e chalés próximos para grupos e famílias.",
    link: "https://www.airbnb.com.br/s/Mairipor%C3%A3--SP/homes",
  },
];

const faqs = [
  {
    q: "Como confirmo minha presença?",
    a: "Pelo botão Confirme sua presença no site: ele abre um formulário rápido. Preencha com carinho para nos ajudar na organização do grande dia.",
  },
  {
    q: "Qual o dress code?",
    a: "Social completo. Evite trajes muito casuais (jeans, tênis esportivo) e, para elas, modelos excessivamente curtos ou com muito brilho.",
  },
  {
    q: "A cerimônia e a festa são no mesmo lugar?",
    a: "Sim. Tudo acontece no Mirante Juruá: a cerimônia começa às 15h30 e a celebração segue em sequência no mesmo espaço.",
  },
  {
    q: "Como funciona a lista de presentes?",
    a: "Escolhemos experiências da nossa lua de mel na Europa. Ao presentear, o valor vai para nossa viagem — com pagamento seguro via Mercado Pago (PIX ou cartão).",
  },
  {
    q: "Como é o clima em janeiro?",
    a: "Janeiro em Mairiporã é verão: costuma fazer calor. Leve um casaquinho leve para o fim da noite.",
  },
  {
    q: "Tem estacionamento?",
    a: "Sim. O Mirante Juruá oferece estacionamento no local.",
  },
];

export default async function HomePage() {
  const mapsEmbed = `https://www.google.com/maps?q=${encodeURIComponent(WEDDING.mapsQuery)}&output=embed`;

  let photos: GalleryPhoto[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("gallery_photos")
      .select("*")
      .eq("is_visible", true)
      .order("sort_order", { ascending: true });
    photos = (data ?? []) as GalleryPhoto[];
  } catch {
    photos = [];
  }

  return (
    <>
      <section className="relative overflow-hidden px-5 pb-20 pt-16 md:pt-24">
        <div className="pointer-events-none absolute inset-0">
          <Image
            src="/hero-couple.jpg"
            alt=""
            fill
            priority
            className="object-cover object-center opacity-55"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-cream/55" />
        </div>
        <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-navy/5 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-navy/5 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <p className="animate-fade-up text-xs tracking-[0.35em] text-navy/60 uppercase">
            Save the Date
          </p>
          <h1 className="animate-fade-up-delay mt-6 font-display text-6xl leading-none text-navy md:text-8xl">
            {WEDDING.groom[0]} & {WEDDING.bride[0]}
          </h1>
          <p className="animate-fade-up-delay mt-4 font-display text-2xl text-navy/80 md:text-3xl">
            {WEDDING.groom} & {WEDDING.bride}
          </p>

          <div className="animate-fade-up-delay-2 mx-auto mt-8 max-w-xs">
            <div className="divider-heart text-sm">♥</div>
          </div>

          <p className="animate-fade-up-delay-2 mt-6 font-display text-3xl tracking-wide text-navy md:text-4xl">
            {WEDDING.dateLabel}
          </p>
          <p className="mt-3 text-sm tracking-[0.18em] text-navy/55 uppercase">
            {WEDDING.tagline}
          </p>

          <div className="mx-auto mt-10 max-w-md">
            <Countdown targetIso={WEDDING.date} />
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <Link href="/#o-grande-dia" className="btn-ghost">
              O grande dia
            </Link>
            <RsvpButton className="btn-primary" />
            <Link href="/presentes" className="btn-ghost">
              Presentear
            </Link>
          </div>

          <p className="mt-10 text-sm text-navy/55">
            {WEDDING.venue} · Mairiporã / SP
          </p>
        </div>
      </section>

      <section className="section border-t border-navy/10 bg-cream-deep/40">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="section-title">Bem-vindos</h2>
          <p className="section-lead mx-auto">
            Preparamos este cantinho com carinho para reunir tudo o que vocês
            precisam saber sobre o nosso dia — e um jeitinho especial de
            contribuir com a nossa lua de mel na Europa.
          </p>
        </div>
      </section>

      <section id="o-grande-dia" className="section">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-start">
          <div>
            <p className="text-xs tracking-[0.25em] text-navy/50 uppercase">O grande dia</p>
            <h2 className="section-title mt-3">Cerimônia & celebração</h2>
            <p className="section-lead">
              A cerimônia começa às {WEDDING.timeLabel}. Em seguida, seguimos a
              festa no mesmo espaço — sem deslocamento entre os momentos.
            </p>

            <dl className="mt-10 space-y-6 text-sm">
              <div>
                <dt className="tracking-[0.16em] text-navy/45 uppercase">Quando</dt>
                <dd className="mt-1 font-display text-2xl text-navy">
                  {WEDDING.dateLabel} · {WEDDING.timeLabel}
                </dd>
              </div>
              <div>
                <dt className="tracking-[0.16em] text-navy/45 uppercase">Onde</dt>
                <dd className="mt-1 font-display text-2xl text-navy">{WEDDING.venue}</dd>
                <dd className="mt-1 text-navy/65">{WEDDING.address}</dd>
              </div>
              <div>
                <dt className="tracking-[0.16em] text-navy/45 uppercase">Dress code</dt>
                <dd className="mt-1 font-display text-2xl text-navy">{WEDDING.dressCode}</dd>
              </div>
            </dl>
          </div>

          <div className="border border-navy/10 bg-white/50 p-7">
            <h3 className="font-display text-2xl text-navy">Como se vestir</h3>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-xs tracking-[0.16em] text-navy/45 uppercase">Para eles</p>
                <p className="mt-2 text-sm leading-relaxed text-navy/70">
                  Traje social completo. Evite jeans, tênis esportivo e looks
                  excessivamente casuais.
                </p>
              </div>
              <div>
                <p className="text-xs tracking-[0.16em] text-navy/45 uppercase">Para elas</p>
                <p className="mt-2 text-sm leading-relaxed text-navy/70">
                  Vestido ou conjunto social. Evite modelos muito curtos ou com
                  excesso de brilho.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="mirante" className="relative isolate min-h-[420px] overflow-hidden md:min-h-[520px]">
        <Image
          src="/mirante-jurua.jpg"
          alt="Vista do Mirante Juruá entre as nuvens"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/35 to-navy/20" />
        <div className="relative z-10 flex min-h-[420px] items-end px-5 py-16 md:min-h-[520px] md:items-center md:justify-center md:py-24">
          <div className="mx-auto max-w-3xl text-center text-cream">
            <p className="text-xs tracking-[0.3em] text-cream/70 uppercase">O local</p>
            <h2 className="mt-4 font-display text-5xl md:text-6xl">Mirante Juruá</h2>
            <p className="mx-auto mt-4 max-w-xl text-cream/80 leading-relaxed">
              Cerimônia e celebração sob o céu da Serra da Cantareira — com a vista
              que faz o coração respirar mais fundo.
            </p>
            <p className="mt-6 text-sm tracking-[0.14em] text-cream/65 uppercase">
              {WEDDING.address}
            </p>
          </div>
        </div>
      </section>

      <section id="como-chegar" className="section border-t border-navy/10 bg-cream-deep/35">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-xs tracking-[0.25em] text-navy/50 uppercase">Localização</p>
            <h2 className="section-title mt-3">Como chegar</h2>
            <p className="section-lead">
              De Campinas até o Mirante Juruá são cerca de 90–110 km (em média
              1h20 a 1h50, conforme o trânsito), pela Dom Pedro I ou
              Anhanguera/Fernão Dias. Há estacionamento no local.
            </p>
          </div>

          <div className="mt-8 overflow-hidden border border-navy/10 bg-white">
            <iframe
              title="Mapa Mirante Juruá"
              src={mapsEmbed}
              className="h-[360px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a href={WEDDING.mapsUrl} target="_blank" rel="noreferrer" className="btn-primary">
              Abrir no Google Maps
            </a>
            <a href={WEDDING.wazeUrl} target="_blank" rel="noreferrer" className="btn-ghost">
              Abrir no Waze
            </a>
          </div>
        </div>
      </section>

      <section id="presenca" className="section">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs tracking-[0.25em] text-navy/50 uppercase">
            Confirmação
          </p>
          <h2 className="section-title mt-3">Confirme sua presença</h2>
          <div className="mx-auto mt-6 max-w-xs">
            <div className="divider-heart text-sm">♥</div>
          </div>
          <p className="section-lead mx-auto mt-6">
            Sua presença tornará nosso dia ainda mais especial. Reserve um
            minutinho para confirmar — assim conseguimos organizar cada detalhe
            com carinho para receber vocês no Mirante Juruá.
          </p>
          <p className="mt-4 text-sm text-navy/55">
            O formulário é rápido e abre em uma nova aba.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <RsvpButton className="btn-primary" />
            <Link href="/#hospedagem" className="btn-ghost">
              Ver hospedagem
            </Link>
          </div>
        </div>
      </section>

      <section id="hospedagem" className="section border-t border-navy/10 bg-cream-deep/35">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-xs tracking-[0.25em] text-navy/50 uppercase">Para convidados</p>
            <h2 className="section-title mt-3">Hospedagem</h2>
            <p className="section-lead">
              Sugestões próximas ao local. Confirme sempre a disponibilidade para
              o fim de semana do casamento.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {lodging.map((item) => (
              <a
                key={item.name}
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="border border-navy/10 bg-white/50 p-6 transition hover:border-navy/30"
              >
                <h3 className="font-display text-2xl text-navy">{item.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-navy/65">{item.note}</p>
                <p className="mt-5 text-xs tracking-[0.14em] text-navy uppercase">
                  Ver opções →
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-navy/10 bg-navy text-cream">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs tracking-[0.25em] text-cream/50 uppercase">Lua de mel</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">
            Experiências na Europa
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-cream/70 leading-relaxed">
            Nossa lista é feita de momentos — Paris, Londres, Madri e a Costa
            Amalfitana. Ao presentear, vocês fazem parte da nossa viagem.
          </p>
          <Link href="/presentes" className="btn-primary mt-8 bg-cream text-navy hover:bg-white">
            Ver lista de presentes
          </Link>
        </div>
      </section>

      <section id="galeria" className="section">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-xs tracking-[0.25em] text-navy/50 uppercase">Memórias</p>
            <h2 className="section-title mt-3">Galeria</h2>
            <p className="section-lead">
              Alguns momentos nossos —{" "}
              <a
                className="underline decoration-navy/30 underline-offset-4"
                href="https://instagram.com/brunocoraal"
                target="_blank"
                rel="noreferrer"
              >
                @brunocoraal
              </a>{" "}
              &{" "}
              <a
                className="underline decoration-navy/30 underline-offset-4"
                href="https://instagram.com/jusantangelo.nutri"
                target="_blank"
                rel="noreferrer"
              >
                @jusantangelo.nutri
              </a>
              .
            </p>
          </div>

          <div className="mt-10">
            <GallerySection photos={photos} />
          </div>
        </div>
      </section>

      <section id="faq" className="section border-t border-navy/10 bg-cream-deep/35">
        <div className="mx-auto max-w-3xl">
          <h2 className="section-title text-center">Perguntas frequentes</h2>
          <div className="mt-10 space-y-4">
            {faqs.map((item) => (
              <details
                key={item.q}
                className="group border border-navy/10 bg-white/50 px-5 py-4 open:bg-white"
              >
                <summary className="cursor-pointer list-none font-display text-xl text-navy">
                  {item.q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-navy/65">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
