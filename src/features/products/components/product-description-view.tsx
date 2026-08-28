"use client";

interface ProductDescriptionViewProps {
  description?: string | null;
  productName: string;
}

export function ProductDescriptionView({
  description,
  productName,
}: ProductDescriptionViewProps) {
  // Rich Tiptap styled default description fallback matching screenshot design
  const defaultRichDescription = `
    <div class="space-y-6">
      <h2 class="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
        Explore ${productName}
      </h2>
      <p class="text-sm sm:text-base text-muted-foreground leading-relaxed">
        Experience high-performance reliability and state-of-the-art engineering designed for versatility, portability, and maximum efficiency in any environment. Built with premium materials to guarantee long-lasting durability.
      </p>

      <div class="my-6 rounded-xl overflow-hidden border border-border shadow-sm">
        <img 
          src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80" 
          alt="${productName} Overview"
          class="w-full h-auto object-cover max-h-105"
        />
      </div>

      <h3 class="text-lg font-bold text-foreground">
        Key Performance Features
      </h3>
      <ul class="list-disc pl-5 space-y-2 text-sm text-foreground/90 leading-relaxed">
        <li><strong>Ultra-Fast Charging & Power Output:</strong> Advanced power management chipset ensures optimal voltage delivery across all connected devices.</li>
        <li><strong>Premium Industrial Design:</strong> Ruggedized impact-resistant casing built for modern lifestyles and rugged outdoor travel.</li>
        <li><strong>Smart Thermal Management:</strong> Integrated active cooling systems prevent overheating under continuous high workloads.</li>
      </ul>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        <div class="p-4 rounded-lg bg-card border border-border">
          <h4 class="font-bold text-sm text-primary mb-1">Long Life Cycle</h4>
          <p class="text-xs text-muted-foreground">Engineered to maintain 80%+ efficiency after thousands of charge cycles.</p>
        </div>
        <div class="p-4 rounded-lg bg-card border border-border">
          <h4 class="font-bold text-sm text-primary mb-1">Eco-Friendly Efficiency</h4>
          <p class="text-xs text-muted-foreground">Consumes minimal idle power while maximizing energy output efficiency.</p>
        </div>
      </div>
    </div>
  `;

  const htmlContent = description || defaultRichDescription;

  return (
    <div id="description" className="flex flex-col gap-3 w-full">
      <h2 className="text-lg font-bold text-foreground tracking-wide">
        Description
      </h2>

      <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
        <div
          className="prose prose-slate dark:prose-invert max-w-none 
            [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4
            [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3
            [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2
            [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-muted-foreground [&_p]:mb-4
            [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_li]:text-sm [&_li]:mb-1
            [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4
            [&_img]:rounded-xl [&_img]:my-6 [&_img]:mx-auto [&_img]:border [&_img]:border-border
            [&_strong]:text-foreground [&_strong]:font-semibold"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  );
}
