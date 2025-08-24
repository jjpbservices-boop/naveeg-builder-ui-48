import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Rocket, Save } from 'lucide-react';
import {
  useOnboardingStore,
  type WebsiteType,
} from '@/lib/stores/useOnboardingStore';
import { updateDesign } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

const FONT_OPTIONS = [
  'Syne',
  'Playfair Display',
  'Montserrat',
  'Poppins',
  'Merriweather',
  'DM Sans',
  'Karla',
  'Inter',
  'Roboto',
  'Lato',
  'Open Sans',
  'Source Sans 3',
  'Noto Sans',
] as const;

export default function Design() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isHydrating, setIsHydrating] = useState(false);
  const hydratedOnce = useRef(false);

  const {
    // state
    colors,
    fonts, // { primary_font }
    pages_meta,
    seo_title,
    seo_description,
    seo_keyphrase,
    website_type,
    website_id,
    unique_id,
    business_name,
    business_description,
    business_type,
    // actions
    updateBasicInfo,
    updateSEO,
    updateWebsiteType,
    updateDesign: updateStoreDesign,
    updateApiData,
    updatePages,
  } = useOnboardingStore();

  // ---------- Auto-hydrate from 10Web sitemap on first arrival ----------
  useEffect(() => {
    // Only hydrate if we have the inputs and no sitemap yet
    const needHydration =
      (!pages_meta || pages_meta.length === 0) &&
      !!(business_name && business_description);

    if (!needHydration || hydratedOnce.current) return;

    hydratedOnce.current = true;
    setIsHydrating(true);

    (async () => {
      try {
        const res = await fetch('/functions/v1/ai-router', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'generate_sitemap',
            params: {
              // send everything the router might use
              website_id, // can be undefined; router may create and return it
              business_type,
              business_name,
              business_description,
              website_type,
            },
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `HTTP ${res.status}`);
        }

        const raw = await res.json();
        // Support both flattened and { data } shapes
        const data = raw?.data ?? raw ?? {};

        // IDs and URLs
        updateApiData({
          website_id: data.website_id ?? website_id,
          unique_id: data.unique_id ?? unique_id,
          preview_url: data.preview_url,
          admin_url: data.admin_url,
        });

        // Website type
        if (data.website_type) {
          updateWebsiteType(data.website_type as WebsiteType);
        }

        // Basic info
        updateBasicInfo({
          business_name: data.business_name ?? business_name,
          business_description: data.business_description ?? business_description,
          business_type: data.business_type ?? business_type,
        });

        // SEO
        updateSEO({
          seo_title: data.website_title ?? seo_title,
          seo_description: data.website_description ?? seo_description,
          seo_keyphrase: data.website_keyphrase ?? seo_keyphrase,
        });

        // Design (colors/fonts)
        if (data.colors || data.fonts) {
          updateStoreDesign({
            colors: data.colors,
            fonts: data.fonts, // expect { primary_font }
          });
        }

        // Pages
        if (Array.isArray(data.pages_meta) && data.pages_meta.length > 0) {
          updatePages(data.pages_meta);
        }

        toast({
          title: 'Sitemap loaded',
          description: 'Fields were prefilled from 10Web.',
        });
      } catch (err: any) {
        console.error('hydrate sitemap failed:', err);
        toast({
          title: 'Failed to load sitemap',
          description: err?.message || 'Could not fetch data.',
          variant: 'destructive',
        });
      } finally {
        setIsHydrating(false);
      }
    })();
  }, [
    pages_meta,
    business_name,
    business_description,
    business_type,
    website_type,
    website_id,
    unique_id,
    updateApiData,
    updateBasicInfo,
    updateSEO,
    updateWebsiteType,
    updateStoreDesign,
    updatePages,
  ]);

  // ---------- Save / Generate ----------
  const isValidHex = (c: string) => /^#[A-Fa-f0-9]{6}$/.test(c);
  const canGenerate =
    isValidHex(colors.primary_color) &&
    isValidHex(colors.secondary_color) &&
    isValidHex(colors.background_dark) &&
    !!website_id &&
    !!unique_id;

  const handleSave = async () => {
    if (!website_id) {
      toast({
        title: 'Error',
        description: 'Missing website ID',
        variant: 'destructive',
      });
      return;
    }
    setIsSaving(true);
    try {
      await updateDesign(website_id, {
        colors,
        fonts, // { primary_font }
        pages_meta,
        seo: {
          title: seo_title,
          description: seo_description,
          keyphrase: seo_keyphrase,
        },
        website_type,
      });
      toast({
        title: 'Design saved',
        description: 'Your design preferences have been saved.',
      });
    } catch (e) {
      console.error(e);
      toast({
        title: 'Save failed',
        description: 'Failed to save design. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerate = async () => {
    if (!canGenerate) return;
    await handleSave();
    navigate({ to: '/generating' });
  };

  // ---------- Derived view data ----------
  const homePage = useMemo(
    () => pages_meta.find((p: any) => (p.title || '').toLowerCase() === 'home'),
    [pages_meta]
  );
  const otherPages = useMemo(
    () => pages_meta.filter((p: any) => (p.title || '').toLowerCase() !== 'home'),
    [pages_meta]
  );

  // ---------- UI ----------
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Stepper */}
        <div className="mb-6 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-full bg-primary text-primary-foreground grid place-items-center">
              1
            </div>
            <span className="font-medium">Site Brief</span>
          </div>
          <div className="h-px flex-1 bg-muted" />
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-full bg-muted-foreground/20 text-muted-foreground grid place-items-center">
              2
            </div>
            <span className="text-muted-foreground">Design</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* LEFT */}
          <div className="md:w-1/3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  Tell us about your business and website
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Business Name */}
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={business_name || ''}
                    onChange={(e) =>
                      updateBasicInfo({ business_name: e.target.value })
                    }
                    placeholder="Bakery Soft"
                  />
                </div>

                {/* Type */}
                <div className="space-y-2">
                  <Label>Type (Choose "ecommerce" for store)</Label>
                  <Select
                    value={website_type || 'basic'}
                    onValueChange={(v) =>
                      updateWebsiteType(v as WebsiteType)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">basic</SelectItem>
                      <SelectItem value="ecommerce">ecommerce</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="businessDescription">
                    Business Description
                  </Label>
                  <Input
                    id="businessDescription"
                    value={business_description || ''}
                    onChange={(e) =>
                      updateBasicInfo({
                        business_description: e.target.value,
                      })
                    }
                    placeholder="Indulge in the finest bread, cakes, and desserts…"
                  />
                </div>

                {/* Font */}
                <div className="space-y-2">
                  <Label htmlFor="primaryFont">Primary Font</Label>
                  <Select
                    value={fonts.primary_font}
                    onValueChange={(v) =>
                      updateStoreDesign({
                        fonts: { primary_font: v as typeof fonts.primary_font },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                      {FONT_OPTIONS.map((f) => (
                        <SelectItem key={f} value={f} style={{ fontFamily: f }}>
                          {f}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* SEO */}
                <div className="space-y-2">
                  <Label htmlFor="seoTitle">Website Title (For SEO)</Label>
                  <Input
                    id="seoTitle"
                    value={seo_title || ''}
                    onChange={(e) => updateSEO({ seo_title: e.target.value })}
                    placeholder="Bakery Soft London - Finest Bakery Near Big Ben"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seoDescription">
                    Website Description (For SEO)
                  </Label>
                  <Input
                    id="seoDescription"
                    value={seo_description || ''}
                    onChange={(e) =>
                      updateSEO({ seo_description: e.target.value })
                    }
                    placeholder="Discover the best bakery in London offering…"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seoKeyphrase">Website Keyphrase (FOR SEO)</Label>
                  <Input
                    id="seoKeyphrase"
                    value={seo_keyphrase || ''}
                    onChange={(e) =>
                      updateSEO({ seo_keyphrase: e.target.value })
                    }
                    placeholder="London bakery near Big Ben"
                  />
                </div>

                {/* Actions */}
                <div className="pt-2 space-y-3">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving || isHydrating}
                    variant="outline"
                    className="w-full"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> Save
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={handleGenerate}
                    disabled={!canGenerate || isHydrating}
                    className="w-full"
                  >
                    {isHydrating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Prefilling…
                      </>
                    ) : (
                      <>
                        <Rocket className="mr-2 h-4 w-4" /> Next Step
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="mt-4 md:hidden">
              <Button variant="outline" className="w-full">
                Show sitemap
              </Button>
            </div>
          </div>

          {/* RIGHT: Desktop sitemap */}
          <div className="md:w-2/3 hidden md:block">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Sitemap</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {homePage && (
                    <div className="mx-auto mb-6 w-max">
                      <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1 text-sm font-medium">
                        <span className="opacity-70">🏠</span> Home
                        <span className="ml-2 inline-grid place-items-center rounded-full border px-1.5 text-xs">
                          +
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap justify-center gap-2">
                        {(homePage.sections || []).map((s: any, i: number) => (
                          <span
                            key={i}
                            className="rounded-full bg-muted px-3 py-1 text-xs"
                          >
                            {s.section_title}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mx-auto mb-6 w-max text-xs text-muted-foreground">
                    <div className="inline-flex items-center gap-2 rounded-full border px-2 py-1">
                      <span className="grid size-4 place-items-center rounded-full border">
                        +
                      </span>
                      Add Page (Max 6)
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {otherPages.map((page: any, idx: number) => (
                      <div key={idx} className="rounded-lg border">
                        <div className="flex items-center justify-between border-b px-3 py-2">
                          <div className="flex items-center gap-2">
                            <span className="grid size-5 place-items-center rounded border text-xs">
                              D
                            </span>
                            <span className="text-sm font-medium">
                              {page.title}
                            </span>
                          </div>
                          <span className="text-muted-foreground">⋯</span>
                        </div>
                        <div className="px-3 py-2 space-y-1">
                          {(page.sections || []).map((s: any, i: number) => (
                            <div
                              key={i}
                              className="text-xs rounded-md border px-2 py-1 bg-muted/40"
                            >
                              {s.section_title}
                            </div>
                          ))}
                          {!page.sections?.length && (
                            <div className="text-xs text-muted-foreground">
                              No sections
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}