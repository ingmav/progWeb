export class App {
    name:string;
    route: string;
    icon: string;
    permission?: string; //Si tiene permisos se motrara/oculatara dependiendo de los permisos que el usuario tenga asignado
    hideHome?:boolean; //Si es verdadero ocultara el elemento que dirige a raiz, en la lista que aparece en los modulos con hijos (la raiz es la ruta de la aplicación padre)
    isHub?:boolean; //Si es verdadero solo mostrara la aplicación en el HUB cuando tenga al menos un hijo activo, de lo contario se ocultara, si es falso siempre estara presente en el HUB (tomando encuenta los permisos asignados) sin importar si tiene hijos o no activos
    children?:App[]; //Lista de modulos y componentes hijos de la aplicación
    apps?:App[]; //Hub secundario de apps
    menu?:Menu[];
}

export class Menu {
    name:string;
    identificador?:string;
    icon?: string;
    permission?: string; //Si tiene permisos se motrara/oculatara dependiendo de los permisos que el usuario tenga asignado
    children:App[]
}

export const APPS:App [] = [
    { name:'Herramientas Dev', route: "dev-tools",  icon: "assets/icons/dev-tools.svg", isHub:true, hideHome:true, permission:"6ARHQGj1N8YPkr02DY04K1Zy7HjIdDcj",
      menu:[
        {
            name:'Tools',
            icon:'settings',
            identificador:'tools',
            children:[
                {name:'Log de Excepciones',   route:'dev-tools/sys-log-errors', icon:'report'               },
                {name:'Reportes MySQL',       route:'dev-tools/mysql-reportes', icon:'insert_drive_file'    },
            ]
        },
      ],
    },
    { name:'Control de Acceso', route: "control-acceso",  icon: "assets/icons/control-acceso.svg", 
        menu:[
            {
                name:'Administrar',
                icon: 'menu_open',
                identificador:'administracion',
                children:[
                    { name:"Usuarios",      route: "control-acceso/usuarios",          icon: "manage_accounts",        permission:"hr5UhgMTDmF9EiLYeq5x0cz0e281IWRU" },
                    { name:'Roles',         route: "control-acceso/roles",             icon: "groups_2",               permission:"gzA7BboE1BpzXZmko6OIDT3EOQRn4otm" },
                ]
            },
            {
                name:'Config',
                icon: 'admin_panel_settings',
                identificador:'configuracion',
                children:[
                    { name:'Permisos',      route: "control-acceso/permisos",          icon: "key",                    permission:"tTVayONYIDylH9dk7jg5143h0FKoSpBi" },
                ]
            }
        ] 
    },
    { name:'Inventario Higiene', route: "inventario-higiene",  icon: "assets/icons/higiene.png", 
        menu:[
            {
                name:'Inventario',
                icon: 'menu_open',
                identificador:'administracion',
                children:[
                    { name:"Listado",      route: "inventario-higiene/listado",          icon: "inbox",        permission:"bTCHPgL2Ovp0UslpRjS38HCp0N93o2zt" },
            ]},
            {
                name:'Catalogos',
                icon: 'drag_indicator',
                identificador:'configuracion',
                children:[
                    { name:'Artículos',      route: "inventario-higiene/articulos",          icon: "bookmark",                    permission:"bTCHPgL2Ovp0UslpRjS38HCp0N93o2zt" },
                    { name:'Personal',      route: "inventario-higiene/personal",          icon: "person_pin",                    permission:"bTCHPgL2Ovp0UslpRjS38HCp0N93o2zt" },
                ]
            }
        ] 
    },
]