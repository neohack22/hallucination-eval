import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { EventData } from '../../types';

interface EventModalProps {
  event: EventData | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  canNavigate: { prev: boolean; next: boolean };
}

const MetadataBadge: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex flex-col space-y-1">
    <span className="text-xs font-medium text-slate-600">{label}</span>
    <Badge variant="secondary" className="text-xs">
      {value}
    </Badge>
  </div>
);

const EventModal: React.FC<EventModalProps> = ({ 
  event, 
  isOpen, 
  onClose, 
  onNavigate, 
  canNavigate 
}) => {
  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Event Analysis</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Event Details */}
          <div>
            <h3 className="text-sm font-medium text-slate-900 mb-3">Event Description</h3>
            <p className="text-slate-900 text-base leading-relaxed mb-4 p-3 bg-slate-50 rounded-lg">
              {event.event.text}
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-slate-700">Ground Truth:</span>
                  <span className="text-sm text-slate-900 font-mono">{event.event.year}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-slate-700">Model Response:</span>
                  <span className="text-sm text-slate-900 font-mono">{event.model_response}</span>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <div className={`flex items-center px-3 py-2 rounded-full text-sm font-medium ${
                  event.is_correct 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {event.is_correct ? '✅ Correct' : '❌ Incorrect'}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-slate-700">Model:</span>
                <Badge variant="outline">{event.model_name}</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-slate-700">Confidence:</span>
                <Badge variant="outline">{event.confidence_score.toFixed(3)}</Badge>
              </div>
            </div>
          </div>
          
          {/* Question */}
          <div>
            <h3 className="text-sm font-medium text-slate-900 mb-2">Question Asked</h3>
            <p className="text-sm text-slate-700 p-3 bg-blue-50 rounded-lg italic">
              "{event.question}"
            </p>
          </div>

          {/* Metadata */}
          <div>
            <h3 className="text-sm font-medium text-slate-900 mb-3">Event Metadata</h3>
            <div className="grid grid-cols-3 gap-4">
              <MetadataBadge label="Category" value={event.event.primary_category} />
              <MetadataBadge label="Violence Level" value={event.event.violence_level} />
              <MetadataBadge label="Scale" value={event.event.scale} />
              <MetadataBadge label="Human Impact" value={event.event.human_impact} />
              <MetadataBadge label="Continental" value={event.event.continental} />
              <MetadataBadge label="Cultural Region" value={event.event.cultural_region} />
              <MetadataBadge label="Development Status" value={event.event.development_status} />
              <MetadataBadge label="Colonial Status" value={event.event.colonial_status} />
              <MetadataBadge label="Historical Period" value={event.event.historical_period} />
              <MetadataBadge label="Century" value={event.event.century} />
              <MetadataBadge label="Decade" value={event.event.decade} />
              <MetadataBadge label="Season" value={event.event.seasonal} />
            </div>
          </div>
        </div>
        
        {/* Navigation & Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-200">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('prev')}
              disabled={!canNavigate.prev}
              className="flex items-center space-x-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('next')}
              disabled={!canNavigate.next}
              className="flex items-center space-x-1"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;

