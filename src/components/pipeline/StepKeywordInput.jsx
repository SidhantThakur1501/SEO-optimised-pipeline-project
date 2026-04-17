import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, X, ArrowRight, Search } from 'lucide-react';

export default function StepKeywordInput({ project, onUpdate, onNext }) {
  const [keywords, setKeywords] = useState(project.keywords || []);
  const [newKeyword, setNewKeyword] = useState('');
  const [contentType, setContentType] = useState(project.content_type || 'blog_post');
  const [targetAudience, setTargetAudience] = useState(project.target_audience || '');
  const [targetRegion, setTargetRegion] = useState(project.target_region || '');

  const addKeyword = () => {
    const kw = newKeyword.trim();
    if (kw && !keywords.includes(kw)) {
      setKeywords([...keywords, kw]);
      setNewKeyword('');
    }
  };

  const removeKeyword = (kw) => {
    setKeywords(keywords.filter(k => k !== kw));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };

  const handleNext = async () => {
    await onUpdate({
      keywords,
      content_type: contentType,
      target_audience: targetAudience,
      target_region: targetRegion,
    });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">Keyword Input</h2>
        <p className="text-muted-foreground text-sm">Enter your target keywords and configure project settings.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 md:col-span-2">
          <Label className="text-foreground">Keywords</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Type a keyword and press Enter..."
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Button onClick={addKeyword} variant="outline" size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[40px]">
            {keywords.map((kw) => (
              <Badge key={kw} variant="secondary" className="bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 text-sm">
                {kw}
                <button onClick={() => removeKeyword(kw)} className="ml-2 hover:text-destructive">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            {keywords.length === 0 && (
              <p className="text-muted-foreground text-sm italic">No keywords added yet</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">Content Type</Label>
          <Select value={contentType} onValueChange={setContentType}>
            <SelectTrigger className="bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="blog_post">Blog Post</SelectItem>
              <SelectItem value="landing_page">Landing Page</SelectItem>
              <SelectItem value="product_page">Product Page</SelectItem>
              <SelectItem value="guide">In-Depth Guide</SelectItem>
              <SelectItem value="listicle">Listicle</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">Target Region</Label>
          <Input
            placeholder="e.g., United States, Global..."
            value={targetRegion}
            onChange={(e) => setTargetRegion(e.target.value)}
            className="bg-secondary border-border"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label className="text-foreground">Target Audience</Label>
          <Textarea
            placeholder="Describe your target audience..."
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            className="bg-secondary border-border resize-none h-20"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          onClick={handleNext}
          disabled={keywords.length === 0}
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
        >
          Classify Intent
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}