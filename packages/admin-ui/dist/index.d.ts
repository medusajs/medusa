import { ComponentType } from 'react';
import webpack, { Configuration } from 'webpack';

declare const forbiddenRoutes: readonly ["/products", "/products/:id", "/product-categories", "/product-categories", "/orders", "/orders/:id", "/customers", "/customers/:id", "/customers/groups", "/customers/groups/:id", "/discounts", "/discounts/new", "/discounts/:id", "/gift-cards", "/gift-cards/:id", "/gift-cards/manage", "/pricing", "/pricing/new", "/pricing/:id", "/inventory", "/collections", "/collections/:id", "/draft-orders", "/draft-orders/:id", "/login", "/sales-channels", "/publishable-api-keys", "/oauth", "/oauth/:app_name"];

declare const injectionZones: readonly ["order.details.before", "order.details.after", "order.list.before", "order.list.after", "draft_order.list.before", "draft_order.list.after", "draft_order.details.before", "draft_order.details.after", "customer.details.before", "customer.details.after", "customer.list.before", "customer.list.after", "customer_group.details.before", "customer_group.details.after", "customer_group.list.before", "customer_group.list.after", "product.details.before", "product.details.after", "product.list.before", "product.list.after", "product_collection.details.before", "product_collection.details.after", "product_collection.list.before", "product_collection.list.after", "price_list.details.before", "price_list.details.after", "price_list.list.before", "price_list.list.after", "discount.details.before", "discount.details.after", "discount.list.before", "discount.list.after", "gift_card.details.before", "gift_card.details.after", "gift_card.list.before", "gift_card.list.after", "custom_gift_card.before", "custom_gift_card.after", "login.before", "login.after"];

type InjectionZone = (typeof injectionZones)[number];
type ForbiddenRoute = (typeof forbiddenRoutes)[number];
interface BaseGeneratedConfig {
    type: "route" | "setting" | "widget";
}
interface RoutingConfig {
    path: string;
}
type LinkConfig = {
    label: string;
    icon?: ComponentType;
};
type RouteConfig = {
    link?: LinkConfig;
};
interface GeneratedRouteConfig extends BaseGeneratedConfig, RoutingConfig, RouteConfig {
    type: "route";
}
type CardConfig = {
    label: string;
    description: string;
    icon?: ComponentType;
};
type SettingConfig = {
    card: CardConfig;
};
interface GeneratedSettingConfig extends BaseGeneratedConfig, RoutingConfig, SettingConfig {
    type: "setting";
}
type WidgetConfig = {
    zone: InjectionZone | InjectionZone[];
};
interface GeneratedWidgetConfig extends BaseGeneratedConfig, WidgetConfig {
    type: "widget";
}
type WidgetExtension = {
    Component: ComponentType;
    config: GeneratedWidgetConfig;
};
type RouteExtension = {
    Component: ComponentType;
    config: GeneratedRouteConfig;
};
type SettingExtension = {
    Component: ComponentType;
    config: GeneratedSettingConfig;
};
type Extension = WidgetExtension | RouteExtension | SettingExtension;
type Notify = {
    success: (title: string, message: string) => void;
    error: (title: string, message: string) => void;
    warn: (title: string, message: string) => void;
    info: (title: string, message: string) => void;
};
interface WidgetProps {
    notify: Notify;
}
interface RouteProps {
    notify: Notify;
}
interface SettingProps {
    notify: Notify;
}

type DevelopOptions = {
    /**
     * Determines whether the development server should open the admin dashboard
     * in the browser.
     *
     * @default true
     */
    open?: boolean;
    /**
     * The port the development server should run on.
     * @default 7001
     * */
    port?: number;
    /**
     * Determines the log level of the development server.
     * @default "error"
     */
    logLevel?: "error" | "none" | "warn" | "info" | "log" | "verbose";
    /**
     * Determines the verbosity of the development server.
     * @default "normal"
     */
    stats?: "normal" | "debug";
};
type AdminOptions = {
    /**
     * The URL of your Medusa instance.
     *
     * This option will only be used if `serve` is `false`.
     */
    backend?: string;
    /**
     * The path to the admin dashboard. The path must be in the format of `/<path>`.
     * The chosen path cannot be one of the reserved paths: "admin", "store".
     * @default "/app"
     */
    path?: string;
    /**
     * The directory to output the build to. By default the plugin will build
     * the dashboard to the `build` directory in the root folder.
     * @default undefined
     */
    outDir?: string;
    /**
     * Options for the development server.
     */
    develop?: DevelopOptions;
};
type BuildReporting = "minimal" | "fancy";
type BaseArgs = {
    appDir: string;
    buildDir: string;
    plugins?: string[];
    options?: AdminOptions;
};
type BuildArgs = BaseArgs & {
    reporting?: BuildReporting;
};
type DevelopArgs = BaseArgs;

/**
 * Builds the admin UI.
 */
declare function build({ appDir, buildDir, plugins, options, reporting, }: BuildArgs): Promise<unknown>;

type CleanArgs = {
    appDir: string;
    outDir: string;
};
/**
 * Cleans the build directory and cache directory.
 */
declare function clean({ appDir, outDir }: CleanArgs): Promise<void>;

/**
 * Starts a development server for the admin UI.
 */
declare function develop({ appDir, buildDir, plugins, options, }: DevelopArgs): Promise<void>;

declare const ALIASED_PACKAGES: readonly ["react", "react-dom", "react-router-dom", "react-dnd", "react-dnd-html5-backend", "react-select", "react-helmet-async", "@tanstack/react-query", "@tanstack/react-table", "@emotion/react", "medusa-react"];

interface LogOptions {
    clearScreen?: boolean;
}
interface LogErrorOptions extends LogOptions {
    error?: Error | null;
}
interface Logger {
    info(msg: string, options?: LogOptions): void;
    warn(msg: string, options?: LogOptions): void;
    error(msg: string, options?: LogErrorOptions): void;
    panic(msg: string, options?: LogErrorOptions): void;
}
declare const logger: Logger;

declare function normalizePath(path: string): string;

declare function findAllValidSettings(dir: string): Promise<{
    path: string;
    file: string;
}[]>;
/**
 * Scans a directory for valid widgets.
 * A valid widget is a file that exports a valid widget config and a valid React component.
 */
declare function findAllValidWidgets(dir: string): Promise<string[]>;
/**
 * Scans a directory for valid routes.
 * A valid route is a file that exports a optional route config and a valid React component.
 */
declare function findAllValidRoutes(dir: string): Promise<{
    path: string;
    hasConfig: boolean;
    file: string;
}[]>;

/**
 * Helper function to create a custom webpack config that can be used to
 * extend the default webpack config used to build the admin UI.
 */
declare function withCustomWebpackConfig(callback: (config: Configuration, webpackInstance: typeof webpack) => Configuration): (config: Configuration, webpackInstance: typeof webpack) => webpack.Configuration;

export { ALIASED_PACKAGES, AdminOptions, DevelopArgs, Extension, ForbiddenRoute, InjectionZone, RouteConfig, RouteExtension, RouteProps, SettingConfig, SettingExtension, SettingProps, WidgetConfig, WidgetExtension, WidgetProps, build, clean, develop, findAllValidRoutes, findAllValidSettings, findAllValidWidgets, forbiddenRoutes, injectionZones, logger, normalizePath, withCustomWebpackConfig };
