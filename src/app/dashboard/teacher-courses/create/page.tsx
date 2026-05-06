'use client';

import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ContentCreationView } from '@/components/dashboard/ContentCreationView';

export default function CreateContentPage() {
    return (
        <DashboardLayout>
            <ContentCreationView />
        </DashboardLayout>
    );
}
