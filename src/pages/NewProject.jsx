import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function NewProject() {
  const [title, setTitle] = useState('');
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setCreating(true);
    const project = await base44.entities.ContentProject.create({
      title: title.trim(),
      status: 'keyword_input',
    });
    navigate(`/pipeline?id=${project.id}`);
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">New Project</h1>
          <p className="text-muted-foreground text-sm">Start your SEO content pipeline</p>
        </div>

        <form onSubmit={handleCreate} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-foreground">Project Title</Label>
            <Input
              placeholder="e.g., Best CRM Tools 2025"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-secondary border-border h-12 text-lg"
              autoFocus
            />
          </div>
          <Button
            type="submit"
            disabled={!title.trim() || creating}
            className="w-full bg-primary hover:bg-primary/90 h-12 text-base gap-2"
          >
            {creating ? 'Creating...' : 'Start Pipeline'}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}