import Image from "next/image";
import {
  createComponentChainLink,
  createPreviewAttributes,
} from "@hygraph/preview-sdk";

type Section = Record<string, unknown> & { __typename: string; id: string };

function chainFor(entryId: string, blockId: string) {
  return [createComponentChainLink("sections", blockId)];
}

function attrs(
  entryId: string,
  chain: ReturnType<typeof createComponentChainLink>[],
  fieldApiId: string,
  extra?: { richText?: "html" | "markdown" | "text" },
) {
  const base = createPreviewAttributes({
    entryId,
    fieldApiId,
    componentChain: chain,
  });
  if (extra?.richText) {
    return {
      ...base,
      "data-hygraph-rich-text-format": extra.richText,
    };
  }
  return base;
}

function sectionChain(entryId: string, blockId: string, fieldApiId: string, extra?: { richText?: "html" }) {
  return attrs(entryId, chainFor(entryId, blockId), fieldApiId, extra);
}

export function SectionRenderer({
  entryId,
  sections,
}: {
  entryId: string;
  sections: Section[] | null | undefined;
}) {
  if (!sections?.length) {
    return null;
  }

  return (
    <div className="flex flex-col">
      {sections.map((section) => (
        <SectionBlock entryId={entryId} key={section.id} section={section} />
      ))}
    </div>
  );
}

function SectionBlock({ entryId, section }: { entryId: string; section: Section }) {
  switch (section.__typename) {
    case "HeroBlock":
      return <Hero entryId={entryId} block={section} />;
    case "RichTextBlock":
      return <RichText entryId={entryId} block={section} />;
    case "CallToActionBanner":
      return <CtaBanner entryId={entryId} block={section} />;
    case "CardGridBlock":
      return <CardGrid entryId={entryId} block={section} />;
    case "FeatureGridBlock":
      return <FeatureGrid entryId={entryId} block={section} />;
    case "StatsBlock":
      return <Stats entryId={entryId} block={section} />;
    case "LogoStripBlock":
      return <LogoStrip entryId={entryId} block={section} />;
    case "QuoteBlock":
      return <Quote entryId={entryId} block={section} />;
    case "MediaWithTextBlock":
      return <MediaWithText entryId={entryId} block={section} />;
    case "FaqBlock":
      return <Faq entryId={entryId} block={section} />;
    default:
      return (
        <div className="bg-zinc-100 px-6 py-8 text-sm text-zinc-600">
          Unsupported block: {section.__typename}
        </div>
      );
  }
}

function Hero({ entryId, block }: { entryId: string; block: Section }) {
  const id = block.id as string;
  const bg = block.backgroundImage as { url?: string } | null;
  return (
    <section className="relative isolate overflow-hidden bg-[#04302a] text-white">
      {bg?.url ? (
        <Image
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          fill
          priority
          sizes="100vw"
          src={bg.url}
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-br from-[#04543f]/95 via-[#04302a]/90 to-[#021a16]/95" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-6 py-20 md:py-28">
        {block.eyebrow ? (
          <p
            className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-200/90"
            {...sectionChain(entryId, id, "eyebrow")}
          >
            {String(block.eyebrow)}
          </p>
        ) : null}
        <h1
          className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl"
          {...sectionChain(entryId, id, "headline")}
        >
          {String(block.headline ?? "")}
        </h1>
        {block.subheadline ? (
          <p
            className="max-w-2xl text-lg text-white/85 md:text-xl"
            {...sectionChain(entryId, id, "subheadline")}
          >
            {String(block.subheadline)}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-4">
          <CtaButton cta={block.primaryCta as Cta | null} />
          <CtaButton cta={block.secondaryCta as Cta | null} variant="ghost" />
        </div>
      </div>
    </section>
  );
}

type Cta = { label?: string; url?: string; variant?: string };

function CtaButton({
  cta,
  variant = "primary",
}: {
  cta: Cta | null | undefined;
  variant?: "primary" | "ghost";
}) {
  if (!cta?.url || !cta.label) {
    return null;
  }
  const base =
    variant === "primary"
      ? "bg-white text-[#04543f] hover:bg-teal-50"
      : "border border-white/40 bg-transparent text-white hover:bg-white/10";
  return (
    <a
      className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition ${base}`}
      href={cta.url}
      rel="noopener noreferrer"
    >
      {cta.label}
    </a>
  );
}

function RichText({ entryId, block }: { entryId: string; block: Section }) {
  const id = block.id as string;
  const body = block.body as { html?: string } | undefined;
  if (!body?.html) {
    return null;
  }
  return (
    <section className="mx-auto max-w-3xl px-6 py-14">
      <div
        className="prose prose-lg prose-zinc max-w-none prose-headings:font-semibold prose-a:text-[#04543f]"
        {...sectionChain(entryId, id, "body", { richText: "html" })}
        dangerouslySetInnerHTML={{ __html: body.html }}
      />
    </section>
  );
}

function CtaBanner({ entryId, block }: { entryId: string; block: Section }) {
  const id = block.id as string;
  const bannerBody = block.bannerBody as { html?: string } | undefined;
  const img = block.image as { url?: string } | null;
  return (
    <section className="border-y border-zinc-200 bg-zinc-50">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-2 md:items-center">
        <div className="flex flex-col gap-4">
          <h2
            className="text-3xl font-semibold tracking-tight text-zinc-900"
            {...sectionChain(entryId, id, "title")}
          >
            {String(block.title ?? "")}
          </h2>
          {bannerBody?.html ? (
            <div
              className="prose prose-zinc max-w-none text-zinc-600"
              {...sectionChain(entryId, id, "body", { richText: "html" })}
              dangerouslySetInnerHTML={{ __html: bannerBody.html }}
            />
          ) : null}
          <div className="pt-2">
            <CtaButton cta={block.cta as Cta | null} />
          </div>
        </div>
        {img?.url ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5">
            <Image
              alt=""
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              src={img.url}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}

function CardGrid({ entryId, block }: { entryId: string; block: Section }) {
  const intro = block.intro as
    | { eyebrow?: string; title?: string; subtitle?: string }
    | null
    | undefined;
  const cards = (block.cards as Section[]) ?? [];
  const bid = block.id as string;
  return (
    <section className="bg-white px-6 py-16">
      <div className="mx-auto max-w-6xl">
        {intro?.title ? (
          <div className="mb-10 max-w-2xl">
            {intro.eyebrow ? (
              <p className="text-sm font-semibold uppercase tracking-widest text-[#04543f]">
                {intro.eyebrow}
              </p>
            ) : null}
            <h2 className="mt-2 text-3xl font-semibold text-zinc-900">
              {intro.title}
            </h2>
            {intro.subtitle ? (
              <p className="mt-3 text-lg text-zinc-600">{intro.subtitle}</p>
            ) : null}
          </div>
        ) : null}
        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <article
              className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50/50 shadow-sm transition hover:shadow-md"
              key={String(card.id)}
            >
              {card.image &&
              typeof card.image === "object" &&
              (card.image as { url?: string }).url ? (
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    alt=""
                    className="object-cover"
                    fill
                    src={(card.image as { url: string }).url}
                  />
                </div>
              ) : null}
              <div className="flex flex-1 flex-col gap-3 p-6">
                <h3
                  className="text-lg font-semibold text-zinc-900"
                  {...attrs(entryId, [...chainFor(entryId, bid), createComponentChainLink("cards", String(card.id))], "title")}
                >
                  {String(card.title ?? "")}
                </h3>
                {card.excerpt ? (
                  <p className="text-sm text-zinc-600">{String(card.excerpt)}</p>
                ) : null}
                {card.href ? (
                  <a
                    className="mt-auto text-sm font-semibold text-[#04543f]"
                    href={String(card.href)}
                  >
                    Learn more →
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureGrid({ entryId, block }: { entryId: string; block: Section }) {
  const intro = block.intro as
    | { eyebrow?: string; title?: string; subtitle?: string }
    | null
    | undefined;
  const features = (block.features as Section[]) ?? [];
  const bid = block.id as string;
  return (
    <section className="bg-zinc-50 px-6 py-16">
      <div className="mx-auto max-w-6xl">
        {intro?.title ? (
          <div className="mb-10 max-w-2xl">
            <h2 className="text-3xl font-semibold text-zinc-900">
              {intro.title}
            </h2>
            {intro.subtitle ? (
              <p className="mt-3 text-lg text-zinc-600">{intro.subtitle}</p>
            ) : null}
          </div>
        ) : null}
        <div className="grid gap-8 md:grid-cols-2">
          {features.map((f) => (
            <div
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
              key={String(f.id)}
            >
              {f.icon && typeof f.icon === "object" && (f.icon as { url?: string }).url ? (
                <div className="relative mb-4 h-10 w-10">
                  <Image
                    alt=""
                    className="object-contain"
                    fill
                    src={(f.icon as { url: string }).url}
                  />
                </div>
              ) : null}
              <h3
                className="text-lg font-semibold"
                {...attrs(entryId, [...chainFor(entryId, bid), createComponentChainLink("features", String(f.id))], "title")}
              >
                {String(f.title ?? "")}
              </h3>
              {f.description &&
              typeof f.description === "object" &&
              (f.description as { html?: string }).html ? (
                <div
                  className="prose prose-sm prose-zinc mt-2 max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: (f.description as { html: string }).html,
                  }}
                />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats({ entryId, block }: { entryId: string; block: Section }) {
  const stats = (block.stats as Section[]) ?? [];
  const intro = block.intro as { title?: string; subtitle?: string } | null;
  const bid = block.id as string;
  return (
    <section className="bg-[#04543f] px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        {intro?.title ? (
          <h2 className="mb-10 max-w-2xl text-3xl font-semibold">{intro.title}</h2>
        ) : null}
        <div className="grid gap-8 md:grid-cols-3">
          {stats.map((s) => (
            <div key={String(s.id)}>
              <div
                className="text-4xl font-semibold tracking-tight"
                {...attrs(entryId, [...chainFor(entryId, bid), createComponentChainLink("stats", String(s.id))], "value")}
              >
                {String(s.value ?? "")}
              </div>
              <div
                className="mt-2 text-sm text-teal-100/90"
                {...attrs(entryId, [...chainFor(entryId, bid), createComponentChainLink("stats", String(s.id))], "label")}
              >
                {String(s.label ?? "")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LogoStrip({ entryId, block }: { entryId: string; block: Section }) {
  const logos = (block.logos as { url?: string }[]) ?? [];
  const bid = block.id as string;
  return (
    <section className="border-y border-zinc-200 bg-white px-6 py-12">
      <div className="mx-auto max-w-6xl">
        {block.title ? (
          <h2 className="mb-8 text-center text-lg font-semibold text-zinc-500" {...sectionChain(entryId, bid, "title")}>
            {String(block.title)}
          </h2>
        ) : null}
        <div className="flex flex-wrap items-center justify-center gap-10 opacity-80">
          {logos.map((logo) =>
            logo.url ? (
              <div className="relative h-8 w-28" key={logo.url}>
                <Image alt="" className="object-contain" fill src={logo.url} />
              </div>
            ) : null,
          )}
        </div>
      </div>
    </section>
  );
}

function Quote({ entryId, block }: { entryId: string; block: Section }) {
  const id = block.id as string;
  return (
    <section className="bg-zinc-100 px-6 py-16">
      <blockquote className="mx-auto max-w-4xl rounded-3xl bg-white p-10 shadow-sm ring-1 ring-black/5">
        <p className="text-2xl font-medium leading-relaxed text-zinc-900" {...sectionChain(entryId, id, "quote")}>
          “{String(block.quote ?? "")}”
        </p>
        <footer className="mt-6 text-sm text-zinc-600">
          <div className="font-semibold text-zinc-900" {...sectionChain(entryId, id, "authorName")}>
            {String(block.authorName ?? "")}
          </div>
          <div {...sectionChain(entryId, id, "authorTitle")}>{String(block.authorTitle ?? "")}</div>
        </footer>
      </blockquote>
    </section>
  );
}

function MediaWithText({ entryId, block }: { entryId: string; block: Section }) {
  const id = block.id as string;
  const body = block.body as { html?: string } | undefined;
  const media = block.media as { url?: string } | null;
  const reverse = block.mediaPosition === "RIGHT";
  return (
    <section className="px-6 py-16">
      <div
        className={`mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 ${reverse ? "md:[&>div:first-child]:order-2" : ""}`}
      >
        {media?.url ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5">
            <Image alt="" className="object-cover" fill src={media.url} />
          </div>
        ) : null}
        <div>
          <h2 className="text-3xl font-semibold text-zinc-900" {...sectionChain(entryId, id, "title")}>
            {String(block.title ?? "")}
          </h2>
          {body?.html ? (
            <div
              className="prose prose-zinc mt-4 max-w-none"
              {...sectionChain(entryId, id, "body", { richText: "html" })}
              dangerouslySetInnerHTML={{ __html: body.html }}
            />
          ) : null}
          <div className="mt-6">
            <CtaButton cta={block.cta as Cta | null} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Faq({ entryId, block }: { entryId: string; block: Section }) {
  const items = (block.items as Section[]) ?? [];
  const intro = block.intro as { title?: string; subtitle?: string } | null;
  return (
    <section className="bg-white px-6 py-16">
      <div className="mx-auto max-w-3xl">
        {intro?.title ? (
          <h2 className="mb-8 text-3xl font-semibold text-zinc-900">{intro.title}</h2>
        ) : null}
        <div className="divide-y divide-zinc-200">
          {items.map((item) => (
            <details className="group py-4" key={String(item.id)} open={false}>
              <summary className="cursor-pointer list-none text-lg font-semibold text-zinc-900">
                {String(item.question ?? "")}
              </summary>
              {item.answer && typeof item.answer === "object" && (item.answer as { html?: string }).html ? (
                <div
                  className="prose prose-zinc mt-3 max-w-none text-zinc-600"
                  dangerouslySetInnerHTML={{
                    __html: (item.answer as { html: string }).html,
                  }}
                />
              ) : null}
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
