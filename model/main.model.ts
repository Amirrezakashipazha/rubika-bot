import React from 'react';

export interface MenuBuilderMainModel {
    error: React.ReactNode;
    data: MenuBuilderDetailModel[] | [];
}

export interface MenuBuilderDetailModel {
    id: number;
    unique_name: string;
    group: string;
    title: string;
    widgets: MenuBuilderWidgetModel[];
    sub_pages: MenuBuilderDetailModel[];
}

export interface MenuBuilderWidgetModel {
    id: number;
    title: string;
    show_more_page: string | null;
    unique_name: string;
    category: string;
    shortcuts: MenuBuilderShortcutModel[];
    ads: AdsModel[] | null;
    schema_data: SchemaDataModel;
    blueprint_unique_name: string;
}

export interface AdsModel {
    content: string;
    action: string | null;
    ad_type: string;
}

export interface SchemaDataModel {
    unit_max_size: number | null;
    show_more_enabled: boolean | null;
    show_title: boolean | null;
    source_url: string | null;
    ad_size: string | null;
    size: string | null;
    show_shortcut_description: string | null;
    background_color: string | null;
    side_image: string | null;
    side_image_behavior: string | null;
    text_color: string | null;
}

export interface MenuBuilderShortcutModel {
    id: number;
    title: MenuBuilderShortcutTitleModel | null;
    unique_name: string;
    cover_url: string | null;
    icon_url: string | null;
    is_enabled: boolean | null;
    login_required: boolean | null;
    tooltip: string | null;
    tooltip_color: string | null;
    icon_color: string;
    url: string | null;
    isDelete?: boolean | null;
}

export interface MenuBuilderShortcutTitleModel {
    fa: string;
    en: string;
    ar?: string;
}
