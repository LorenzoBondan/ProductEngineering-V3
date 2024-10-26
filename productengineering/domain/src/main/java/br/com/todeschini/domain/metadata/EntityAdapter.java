package br.com.todeschini.domain.metadata;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Anotação para marcar adaptadores de domínio para entidade.
 * Utilizado para instanciar adaptadores de forma genérica no método de edição em lote
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface EntityAdapter {
    Class<?> entityClass();
}
