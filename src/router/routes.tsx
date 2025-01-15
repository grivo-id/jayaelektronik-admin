import { lazy } from 'react';
const Index = lazy(() => import('../pages/Index'));
const Analytics = lazy(() => import('../pages/Analytics'));
const Finance = lazy(() => import('../pages/Finance'));
const Contacts = lazy(() => import('../pages/Apps/Contacts'));
const List = lazy(() => import('../pages/Apps/Invoice/List'));
const Preview = lazy(() => import('../pages/Apps/Invoice/Preview'));
const Add = lazy(() => import('../pages/Apps/Invoice/Add'));
const Edit = lazy(() => import('../pages/Apps/Invoice/Edit'));
const Tabs = lazy(() => import('../pages/Components/Tabs'));
const Accordians = lazy(() => import('../pages/Components/Accordians'));
const Modals = lazy(() => import('../pages/Components/Modals'));
const Cards = lazy(() => import('../pages/Components/Cards'));
const Carousel = lazy(() => import('../pages/Components/Carousel'));
const Countdown = lazy(() => import('../pages/Components/Countdown'));
const Counter = lazy(() => import('../pages/Components/Counter'));
const SweetAlert = lazy(() => import('../pages/Components/SweetAlert'));
const Timeline = lazy(() => import('../pages/Components/Timeline'));
const Notification = lazy(() => import('../pages/Components/Notification'));
const MediaObject = lazy(() => import('../pages/Components/MediaObject'));
const ListGroup = lazy(() => import('../pages/Components/ListGroup'));
const PricingTable = lazy(() => import('../pages/Components/PricingTable'));
const LightBox = lazy(() => import('../pages/Components/LightBox'));
const Alerts = lazy(() => import('../pages/Elements/Alerts'));
const Avatar = lazy(() => import('../pages/Elements/Avatar'));
const Badges = lazy(() => import('../pages/Elements/Badges'));
const Breadcrumbs = lazy(() => import('../pages/Elements/Breadcrumbs'));
const Buttons = lazy(() => import('../pages/Elements/Buttons'));
const Buttongroups = lazy(() => import('../pages/Elements/Buttongroups'));
const Colorlibrary = lazy(() => import('../pages/Elements/Colorlibrary'));
const DropdownPage = lazy(() => import('../pages/Elements/DropdownPage'));
const Infobox = lazy(() => import('../pages/Elements/Infobox'));
const Jumbotron = lazy(() => import('../pages/Elements/Jumbotron'));
const Loader = lazy(() => import('../pages/Elements/Loader'));
const Pagination = lazy(() => import('../pages/Elements/Pagination'));
const Popovers = lazy(() => import('../pages/Elements/Popovers'));
const Progressbar = lazy(() => import('../pages/Elements/Progressbar'));
const Search = lazy(() => import('../pages/Elements/Search'));
const Tooltip = lazy(() => import('../pages/Elements/Tooltip'));
const Treeview = lazy(() => import('../pages/Elements/Treeview'));
const Typography = lazy(() => import('../pages/Elements/Typography'));
const Widgets = lazy(() => import('../pages/Widgets'));
const FontIcons = lazy(() => import('../pages/FontIcons'));
const DragAndDrop = lazy(() => import('../pages/DragAndDrop'));
const Tables = lazy(() => import('../pages/Tables'));
const Basic = lazy(() => import('../pages/DataTables/Basic'));
const Advanced = lazy(() => import('../pages/DataTables/Advanced'));
const Skin = lazy(() => import('../pages/DataTables/Skin'));
const OrderSorting = lazy(() => import('../pages/DataTables/OrderSorting'));
const MultiColumn = lazy(() => import('../pages/DataTables/MultiColumn'));
const MultipleTables = lazy(() => import('../pages/DataTables/MultipleTables'));
const AltPagination = lazy(() => import('../pages/DataTables/AltPagination'));
const Checkbox = lazy(() => import('../pages/DataTables/Checkbox'));
const RangeSearch = lazy(() => import('../pages/DataTables/RangeSearch'));
const Export = lazy(() => import('../pages/DataTables/Export'));
const ColumnChooser = lazy(() => import('../pages/DataTables/ColumnChooser'));
const Profile = lazy(() => import('../pages/Users/Profile'));
const AccountSetting = lazy(() => import('../pages/Users/AccountSetting'));
const KnowledgeBase = lazy(() => import('../pages/Pages/KnowledgeBase'));
const ContactUsBoxed = lazy(() => import('../pages/Pages/ContactUsBoxed'));
const ContactUsCover = lazy(() => import('../pages/Pages/ContactUsCover'));
const Faq = lazy(() => import('../pages/Pages/Faq'));
const ComingSoonBoxed = lazy(() => import('../pages/Pages/ComingSoonBoxed'));
const ComingSoonCover = lazy(() => import('../pages/Pages/ComingSoonCover'));
const ERROR404 = lazy(() => import('../pages/Pages/Error404'));
const ERROR500 = lazy(() => import('../pages/Pages/Error500'));
const ERROR503 = lazy(() => import('../pages/Pages/Error503'));
const Maintenence = lazy(() => import('../pages/Pages/Maintenence'));
const LoginBoxed = lazy(() => import('../pages/Authentication/LoginBoxed'));
const About = lazy(() => import('../pages/About'));
const Error = lazy(() => import('../components/Error'));
const Charts = lazy(() => import('../pages/Charts'));
const FormBasic = lazy(() => import('../pages/Forms/Basic'));
const FormInputGroup = lazy(() => import('../pages/Forms/InputGroup'));
const FormLayouts = lazy(() => import('../pages/Forms/Layouts'));
const Validation = lazy(() => import('../pages/Forms/Validation'));
const InputMask = lazy(() => import('../pages/Forms/InputMask'));
const Select2 = lazy(() => import('../pages/Forms/Select2'));
const Touchspin = lazy(() => import('../pages/Forms/TouchSpin'));
const CheckBoxRadio = lazy(() => import('../pages/Forms/CheckboxRadio'));
const Switches = lazy(() => import('../pages/Forms/Switches'));
const Wizards = lazy(() => import('../pages/Forms/Wizards'));
const FileUploadPreview = lazy(() => import('../pages/Forms/FileUploadPreview'));
const QuillEditor = lazy(() => import('../pages/Forms/QuillEditor'));
const MarkDownEditor = lazy(() => import('../pages/Forms/MarkDownEditor'));
const DateRangePicker = lazy(() => import('../pages/Forms/DateRangePicker'));
const Clipboard = lazy(() => import('../pages/Forms/Clipboard'));
const Blog = lazy(() => import('../pages/Apps/Blog'));
const BlogCreation = lazy(() => import('../pages/Apps/BlogCreation'));
const BlogCategories = lazy(() => import('../pages/Apps/BlogCategories'));
const ProductCategories = lazy(() => import('../pages/Apps/ProductCategory'));
const Overview = lazy(() => import('../pages/Overview'));
const BlogKeywords = lazy(() => import('../pages/Apps/BlogKeywords'));
const BlogDetail = lazy(() => import('../pages/Apps/BlogDetail'));
const Brands = lazy(() => import('../pages/Apps/Brands'));

const routes = [
    // dashboard
    {
        path: '/',
        element: <Index />,
    },
    {
        path: '/overview',
        element: <Overview />,
    },
    // {
    //     path: '/index',
    //     element: <Index />,
    // },
    // analytics page
    {
        path: '/analytics',
        element: <Analytics />,
    },
    // finance page
    {
        path: '/finance',
        element: <Finance />,
    },

    {
        path: '/apps/contacts',
        element: <Contacts />,
    },

    {
        path: '/apps/blogs',
        element: <Blog />,
    },
    {
        path: '/apps/blog-categories',
        element: <BlogCategories />,
    },
    {
        path: '/apps/blog-keywords',
        element: <BlogKeywords />,
    },

    {
        path: '/apps/product-categories',
        element: <ProductCategories />,
    },

    {
        path: '/apps/invoice/list',
        element: <List />,
    },

    // ========================================================================================================//

    {
        path: '/admin/list-order-customer',
    },

    {
        path: '/admin/manage-product',
    },

    {
        path: '/admin/manage-product-category',
    },

    {
        path: '/admin/manage-product-sub-category',
    },

    {
        path: '/admin/manage-coupon-discount',
    },

    {
        path: '/admin/manage-home-banner',
    },

    {
        path: '/admin/manage-deals-of-the-week',
    },

    {
        path: '/admin/manage-blog',
        element: <Blog />,
    },

    {
        path: '/admin/manage-blog/create',
        element: <BlogCreation />,
    },
    {
        path: '/admin/manage-blog/:id',
        element: <BlogDetail />,
    },

    {
        path: '/admin/manage-blog-category',
        element: <BlogCategories />,
    },

    {
        path: '/admin/manage-keywords',
        element: <BlogKeywords />,
    },

    {
        path: '/admin/manage-brand',
        element: <Brands />,
    },

    {
        path: '/manager/manage-user',
    },

    {
        path: '/manager/manage-admin',
    },

    {
        path: '/setting/account-profile',
    },

    // ========================================================================================================//

    // preview page
    {
        path: '/apps/invoice/preview',
        element: <Preview />,
    },
    {
        path: '/apps/invoice/add',
        element: <Add />,
    },
    {
        path: '/apps/invoice/edit',
        element: <Edit />,
    },
    // components page
    {
        path: '/components/tabs',
        element: <Tabs />,
    },
    {
        path: '/components/accordions',
        element: <Accordians />,
    },
    {
        path: '/components/modals',
        element: <Modals />,
    },
    {
        path: '/components/cards',
        element: <Cards />,
    },
    {
        path: '/components/carousel',
        element: <Carousel />,
    },
    {
        path: '/components/countdown',
        element: <Countdown />,
    },
    {
        path: '/components/counter',
        element: <Counter />,
    },
    {
        path: '/components/sweetalert',
        element: <SweetAlert />,
    },
    {
        path: '/components/timeline',
        element: <Timeline />,
    },
    {
        path: '/components/notifications',
        element: <Notification />,
    },
    {
        path: '/components/media-object',
        element: <MediaObject />,
    },
    {
        path: '/components/list-group',
        element: <ListGroup />,
    },
    {
        path: '/components/pricing-table',
        element: <PricingTable />,
    },
    {
        path: '/components/lightbox',
        element: <LightBox />,
    },
    // elements page
    {
        path: '/elements/alerts',
        element: <Alerts />,
    },
    {
        path: '/elements/avatar',
        element: <Avatar />,
    },
    {
        path: '/elements/badges',
        element: <Badges />,
    },
    {
        path: '/elements/breadcrumbs',
        element: <Breadcrumbs />,
    },
    {
        path: '/elements/buttons',
        element: <Buttons />,
    },
    {
        path: '/elements/buttons-group',
        element: <Buttongroups />,
    },
    {
        path: '/elements/color-library',
        element: <Colorlibrary />,
    },
    {
        path: '/elements/dropdown',
        element: <DropdownPage />,
    },
    {
        path: '/elements/infobox',
        element: <Infobox />,
    },
    {
        path: '/elements/jumbotron',
        element: <Jumbotron />,
    },
    {
        path: '/elements/loader',
        element: <Loader />,
    },
    {
        path: '/elements/pagination',
        element: <Pagination />,
    },
    {
        path: '/elements/popovers',
        element: <Popovers />,
    },
    {
        path: '/elements/progress-bar',
        element: <Progressbar />,
    },
    {
        path: '/elements/search',
        element: <Search />,
    },
    {
        path: '/elements/tooltips',
        element: <Tooltip />,
    },
    {
        path: '/elements/treeview',
        element: <Treeview />,
    },
    {
        path: '/elements/typography',
        element: <Typography />,
    },

    // charts page
    {
        path: '/charts',
        element: <Charts />,
    },
    // widgets page
    {
        path: '/widgets',
        element: <Widgets />,
    },
    //  font-icons page
    {
        path: '/font-icons',
        element: <FontIcons />,
    },
    //  Drag And Drop page
    {
        path: '/dragndrop',
        element: <DragAndDrop />,
    },
    //  Tables page
    {
        path: '/tables',
        element: <Tables />,
    },
    // Data Tables
    {
        path: '/datatables/basic',
        element: <Basic />,
    },
    {
        path: '/datatables/advanced',
        element: <Advanced />,
    },
    {
        path: '/datatables/skin',
        element: <Skin />,
    },
    {
        path: '/datatables/order-sorting',
        element: <OrderSorting />,
    },
    {
        path: '/datatables/multi-column',
        element: <MultiColumn />,
    },
    {
        path: '/datatables/multiple-tables',
        element: <MultipleTables />,
    },
    {
        path: '/datatables/alt-pagination',
        element: <AltPagination />,
    },
    {
        path: '/datatables/checkbox',
        element: <Checkbox />,
    },
    {
        path: '/datatables/range-search',
        element: <RangeSearch />,
    },
    {
        path: '/datatables/export',
        element: <Export />,
    },
    {
        path: '/datatables/column-chooser',
        element: <ColumnChooser />,
    },
    // Users page
    {
        path: '/users/profile',
        element: <Profile />,
    },
    {
        path: '/users/user-account-settings',
        element: <AccountSetting />,
    },
    // pages
    {
        path: '/pages/knowledge-base',
        element: <KnowledgeBase />,
    },
    {
        path: '/pages/contact-us-boxed',
        element: <ContactUsBoxed />,
        layout: 'blank',
    },
    {
        path: '/pages/contact-us-cover',
        element: <ContactUsCover />,
        layout: 'blank',
    },
    {
        path: '/pages/faq',
        element: <Faq />,
    },
    {
        path: '/pages/coming-soon-boxed',
        element: <ComingSoonBoxed />,
        layout: 'blank',
    },
    {
        path: '/pages/coming-soon-cover',
        element: <ComingSoonCover />,
        layout: 'blank',
    },
    {
        path: '/pages/error404',
        element: <ERROR404 />,
        layout: 'blank',
    },
    {
        path: '/pages/error500',
        element: <ERROR500 />,
        layout: 'blank',
    },
    {
        path: '/pages/error503',
        element: <ERROR503 />,
        layout: 'blank',
    },
    {
        path: '/pages/maintenence',
        element: <Maintenence />,
        layout: 'blank',
    },
    //Authentication
    {
        path: '/login',
        element: <LoginBoxed />,
        layout: 'blank',
    },

    //forms page
    {
        path: '/forms/basic',
        element: <FormBasic />,
    },
    {
        path: '/forms/input-group',
        element: <FormInputGroup />,
    },
    {
        path: '/forms/layouts',
        element: <FormLayouts />,
    },
    {
        path: '/forms/validation',
        element: <Validation />,
    },
    {
        path: '/forms/input-mask',
        element: <InputMask />,
    },
    {
        path: '/forms/select2',
        element: <Select2 />,
    },
    {
        path: '/forms/touchspin',
        element: <Touchspin />,
    },
    {
        path: '/forms/checkbox-radio',
        element: <CheckBoxRadio />,
    },
    {
        path: '/forms/switches',
        element: <Switches />,
    },
    {
        path: '/forms/wizards',
        element: <Wizards />,
    },
    {
        path: '/forms/file-upload',
        element: <FileUploadPreview />,
    },
    {
        path: '/forms/quill-editor',
        element: <QuillEditor />,
    },
    {
        path: '/forms/markdown-editor',
        element: <MarkDownEditor />,
    },
    {
        path: '/forms/date-picker',
        element: <DateRangePicker />,
    },
    {
        path: '/forms/clipboard',
        element: <Clipboard />,
    },
    {
        path: '/about',
        element: <About />,
        layout: 'blank',
    },
    {
        path: '/blog',
        element: <Blog />,
    },
    {
        path: '/blog/create',
        element: <BlogCreation />,
    },
    {
        path: '/blog/:id',
        element: <BlogDetail />,
    },
    {
        path: '*',
        element: <Error />,
        layout: 'blank',
    },
];

export { routes };
