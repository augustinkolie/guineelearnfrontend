'use client';

import React from 'react';
import { MessagesView } from '@/components/dashboard/MessagesView';
import { CoursesView } from '@/components/dashboard/CoursesView';
import { QuizView } from '@/components/dashboard/QuizView';
import { ProfileView } from '@/components/dashboard/ProfileView';

export interface DashboardStrategyProps {
    role: string;
    activeTab: string;
    user?: any;
    profile?: any;
    currentUserId?: string;
}

/**
 * Strategy Pattern (GoF / OCP)
 * Permet d'étendre la liste des vues de dashboard par clé/rôle sans modifier de grosses structures de if/else.
 */
type ViewRenderer = (props: DashboardStrategyProps) => React.ReactNode;

const viewStrategies: Record<string, ViewRenderer> = {
    messages: (props) => <MessagesView currentUserId={props.currentUserId || props.user?.id || ''} />,
    courses: () => <CoursesView profile={null} />,
    quiz: () => <QuizView profile={null} />,
    profile: (props) => <ProfileView user={props.user} profile={props.profile} />,
};

export class DashboardStrategyResolver {
    public static renderView(tab: string, props: DashboardStrategyProps): React.ReactNode {
        const renderer = viewStrategies[tab];
        if (renderer) {
            return renderer(props);
        }
        return (
            <div className="p-8 text-center text-slate-500">
                Vue &quot;{tab}&quot; non configurée ou en cours de chargement.
            </div>
        );
    }

    public static registerView(tab: string, renderer: ViewRenderer): void {
        viewStrategies[tab] = renderer;
    }
}
