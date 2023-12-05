const es = {
    pages: {
        home: {
            headTitle: "Inicio",
            featuredProducts: "Productos destacados",
            banner: {
                title: "Cabello fantástico en segundos",
                subtitle: "Cambia tu estilo en un instante sin dañar tu cabello",
                button: "Comprar ahora"
            },
            sections: {
                categories: {
                    title: "Colecciones",
                    wigs: "Pelucas",
                    extensions: "Extensiones"
                },
                products: {
                    wigs: {
                        title: "Pelucas"
                    },
                    extensions: {
                        title: "Extensiones"
                    },
                    viewAll: "Ver más"
                }
            },
            aboutUs: {
                title: "Acerca de nosotros"
            }
        },
        product: {
            headTitle: "Produkt"
        },
        cart: {
            headTitle: "Carrito de compras",
            items: "Elementos",
            productDetails: "Detalles del producto",
            amount: "Cantidad",
            total: "Total",
            removeProduct: "Eliminar",
            payButton: "Ir a pagar"
        },
        collections: {
            all: {
                headTitle: "Colección: Todas"
            },
            wigs: {
                headTitle: "Colección: Pelucas"
            },
            extensions: {
                headTitle: "Colección: Extensiones"
            }
        },
        checkout: {
            headTitle: "Pedido",
            signIn: {
                text: "¿Tienes una cuenta?",
                link: "Iniciar sesión"
            },
            orderResume: "Resumen del pedido",
            noProductsInCart: "Aún no hay productos en tu carrito",
            addProductsToCart: "Agrega productos y luego ven a pagar",
            forms: {
                contact: {
                    title: "Contacto",
                    placeholders: {
                        email: "Correo electrónico"
                    }
                },
                shipping: {
                    title: "Envío",
                    countries: {
                        de: "Alemania"
                    },
                    placeholders: {
                        name: "Nombre",
                        surname: "Apellidos",
                        address: "Dirección",
                        postalCode: "Código postal",
                        city: "Ciudad",
                        phoneNumber: "Número de teléfono",
                    }
                },
                payment: {
                    title: "Pago",
                    creditcard: "Tarjeta de crédito / débito",
                    paypal: "PayPal",
                    card: {
                        first: "Luego de hacer clic en",
                        second: "serás redirigido a",
                        third: "para completar tu compra de forma segura."
                    }
                },
                submit: "Proceder a pagar"
            }
        },
        login: {
            headTitle: "Iniciar sesión",
            title: "Iniciar sesión",
            inputs: {
                placeholders: {
                    email: "Correo electrónico",
                    password: "Contraseña"
                }
            },
            submitBtn: "Iniciar sesión",
            alreadyLoggedIn: "Ya iniciaste sesión",
            createAccount: {
                text: "No tienes cuenta?",
                link: "Crear cuenta"
            },
            forgotPassword: {
                text: "Olvidaste tu contraseña?",
                link: "Recuperar contraseña"
            }
        },
        register: {
            headTitle: "Registrar cuenta",
            title: "Registrar cuenta",
            inputs: {
                placeholders: {
                    name: "Nombre",
                    surname: "Apellido",
                    email: "Correo electrónico",
                    password: "Contraseña",
                    repeatPassword: "Repetir contraseña"
                }
            },
            checkBox: {
                text: "Leí y acepto la ",
                link: "Protección de datos"
            },
            submitBtn: "Registrar cuenta",
            signIn: {
                text: "Ya tienes cuenta?",
                link: "Iniciar sesión"
            }
        },
        recover: {
            headTitle: "Recuperar cuenta",
            title: "Recuperar cuenta",
            submitBtn: "Recuperar cuenta",
            inputs: {
                placeholders: {
                    email: "Correo electrónico"
                }
            },
        },
        newPassword: {
            headTitle: "Nueva contraseña",
            title: "Nueva contraseña",
            submitBtn: "Cambiar contraseña",
            inputs: {
                placeholders: {
                    password: "Contraseña",
                    repeatPassword: "Repetir contraseña"
                }
            },
        },
        orders: {
            paymentStatus: {
                COMPLETED: "Completado",
                PARTIALLY_REFUNDED: "Parcialmente reembolsado",
                PENDING: "Pendiente",
                FAILED: "Fallido",
                VOIDED: "Anulado",
                IN_PROGRESS: "En progreso"
            }
        }
    },
    header: {
        wigs: "Pelucas",
        extensions: "Extensiones",
        langs: {
            language: "Idioma",
            de: "Alemán",
            en: "Inglés",
            es: "Español",
        },
        currencies: {
            currency: "Divisa",
            EUR: "EUR (€)",
            USD: "USD ($)"
        },
        apply: "Aplicar"
    },
    footer: {
        columns: {
            navigation: {
                title: "Navegación",
                items: {
                    home: "Inicio",
                    wigs: "Pelucas",
                    extensions: "Extensiones"
                }
            },
            legal: {
                title: "Legal",
                items: {
                    impressum: "Aviso legal",
                    datenschutz: "Protección de datos"
                }
            },
            socials: {
                title: "Redes sociales",
                items: {
                    facebook: "Facebook",
                    instagram: "Instagram",
                    tiktok: "TikTok"
                }
            }
        }
    },
    product: {
        addToCart: "Agregar al carrito",
        notFound: "No se encontraron productos",
        removeFilters: {
            text: "Usa menos filtros o",
            button: "borralos todos"
        },
        filters: {
            availability: "Disponibilidad",
            price: "Precio",
            products: "productos",
            selected: "seleccionado",
            select: "Seleccionar",
            clear: "Limpiar",
            inStock: "En existencia",
            outOfStock: "Agotado",
            highestPrice: "Precio más alto",
            from: "Desde",
            to: "Hasta",
            sortBy: "Ordenar por:",
            lowPrice: "Menor precio",
            highPrice: "Mayor precio"
        },
        categories: {
            wigs: "Pelucas"
        },
        description: "Descripción del producto",
        amount: "Cantidad",
        price: "Precio"
    },
    notifications: {
        success: {
            productAdded: "Producto agregado al carrito",
            orderPlaced: "Orden creada con éxito",
            loggedIn: "Iniciaste sesión correctamente!",
            accountCreated: "Se ha creado tu cuenta correctamente",
            recoverAccount: "Se han enviado instrucciones a tu email",
            newPassword: "Se ha actualizado tu contraseña!"
        },
        error: {
            alreadyLoggedIn: "Ya iniciaste sesión",
            missingFields: "Debes llenar todos los campos",
            dataProtection: "Debes aceptar los términos de protección de datos",
            login: "Hubo un error al iniciar sesión",
            createAccount: "Hubo un error al crear la cuenta",
            recoverAccount: "Hubo un error al recuperar tu cuenta",
            passwordsDontMatch: "Las contraseñas no coinciden",
            newPassword: "Hubo un error al actualizar tu contraseña"
        }
    }
}

export default es;