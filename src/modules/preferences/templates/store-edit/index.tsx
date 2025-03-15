"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { ContainerPreference } from "../../components/container-preference";
import { HeaderPreference } from "../../components/header-preference";
import { StoreData } from "../../components/store-data";
import { AddressContent } from "@/modules/preferences/components/address-content";
import { Delivery } from "../../components/delivey-preference";
import Button from "@/modules/app/components/button/button";
import { useStore } from "@/modules/app/store/stores";
import { useEffect } from "react";
import { formatPhone } from "@/formatting/phone";
import { formatDocumentNumber } from "@/formatting";
import { useLoading, useToast } from "@/modules/app/hooks";
import Toast from "@/modules/app/components/toast";
import { preferencesService } from "../../services";
import StoreModel, { OpeningHours } from "@/modules/app/models/store";
import { availableHasOpeningHour, availableOpeningHour } from "@/utils";

const editStoreSchema = z
  .object({
    name: z
      .string()
      .min(3, "O nome precisa ter menos mais de 3 caracteres")
      .max(255),

    phone: z
      .string()
      .min(0, "Telefone inválido")
      .transform((value) => value.replace(/\D/g, "")),
    email: z.string().email("Email inválido"),
    documentNumber: z
      .string()
      .min(1, { message: "Cpf ou Cnpj é obrigatório" })
      .max(18, { message: "Cpf ou Cnpj inválido" })
      .transform((value) => value.replace(/\D/g, "")),
    type: z.string().min(3, "Tipo de loja obrigatório"),
    specialties: z.array(z.string().min(3, "Especialidade obrigatória")),
    address: z.object({
      street: z.string().min(3, "Rua obrigatória"),
      number: z.string().min(1, "Número obrigatório"),
      neighborhood: z.string().min(3, "Bairro obrigatório"),
      city: z.string().min(3, "Cidade obrigatória"),
      state: z.string().min(2, "Estado obrigatório"),
      zip: z
        .string()
        .min(1, "Cep obrigatório")
        .transform((value) => value.replace(/\D/g, "")),
    }),
    delivery: z.object({
      price: z.number(),
      estimatedMaxTime: z.number(),
      minOrder: z.number(),
      estimatedMinTime: z.number(),
    }),
    openingHours: z.object({
      sunday: z
        .object({
          openHour: z.string().optional(),
          closeHour: z.string().optional(),
        })
        .optional(),
      monday: z
        .object({
          openHour: z.string().optional(),
          closeHour: z.string().optional(),
        })
        .optional(),
      tuesday: z
        .object({
          openHour: z.string().optional(),
          closeHour: z.string().optional(),
        })
        .optional(),
      wednesday: z
        .object({
          openHour: z.string().optional(),
          closeHour: z.string().optional(),
        })
        .optional(),
      thursday: z
        .object({
          openHour: z.string().optional(),
          closeHour: z.string().optional(),
        })
        .optional(),
      friday: z
        .object({
          openHour: z.string().optional(),
          closeHour: z.string().optional(),
        })
        .optional(),
      saturday: z
        .object({
          openHour: z.string().optional(),
          closeHour: z.string().optional(),
        })
        .optional(),
    }),
  })
  .refine(
    (data) => {
      if (
        Number(data.delivery.estimatedMinTime) >=
        Number(data.delivery.estimatedMaxTime)
      ) {
        return false;
      }

      return true;
    },
    {
      message: "Tempo mínimo não pode ser maior ou igual ao tempo máximo",
      path: ["delivery", "estimatedMinTime"],
    }
  )
  .refine(
    (data) => {
      if (data.openingHours) {
        return availableHasOpeningHour(data.openingHours as OpeningHours);
      }
    },
    {
      message: "Preencha o horário de abertura e fechamento",
      path: ["openingHours"],
    }
  )
  .refine(
    (data) => {
      if (data.openingHours) {
        return availableOpeningHour(data.openingHours as OpeningHours);
      }
    },
    {
      message:
        "Horário de abertura não pode ser maior ou igual ao de fechamento",
      path: ["openingHours"],
    }
  );

export type EditStore = z.infer<typeof editStoreSchema>;

export function ScreenStore() {
  const [isLoadingSubmit, startLoading, stopLoading] = useLoading();
  const { error: errorToast, toast, setToast, success } = useToast();
  const [store, setStore] = useStore((state) => [state.store, state.setStore]);
  const {
    formState: { errors },
    setValue,
    handleSubmit,
    getValues,
    register,
  } = useForm<EditStore>({
    resolver: zodResolver(editStoreSchema),
  });

  useEffect(() => {
    if (errors?.openingHours) {
      errorToast(errors?.openingHours?.root?.message);
    }
  }, [errors]);

  console.log(store);

  useEffect(() => {
    if (store) {
      Object.keys(store).forEach((key) => {
        switch (key) {
          case "phone":
            setValue(key, formatPhone(store[key]));
            break;
          case "documentNumber":
            setValue(key, formatDocumentNumber(store[key]));
          default:
            setValue(key as any, store[key]);
        }
      });
    }
  }, [store]);

  async function onSubmit(data: EditStore) {
    startLoading();
    try {
      await preferencesService.updateStore(
        store.id,
        data as unknown as StoreModel
      );

      success("Loja atualizada com sucesso!");
      setStore(data as unknown as StoreModel);
    } catch (error) {
      console.log(error);
      errorToast("Erro ao salvar, tente novamente.");
    } finally {
      stopLoading();
    }
  }

  console.log(errors);

  if (!store.id) return <h1>Carregando</h1>;

  return (
    <div>
      <section>
        <HeaderPreference
          backgroundImage={store.cover}
          name={store.name}
          profileImage={store.logo}
          email={store.email}
        />
      </section>

      <section>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full mb-10 space-y-5">
            <ContainerPreference
              title="Dados da loja"
              description="Atualize o perfil da sua loja aqui"
            >
              <StoreData
                register={register}
                errors={errors}
                setValue={setValue}
              />
            </ContainerPreference>

            <hr className="border border-gray-700" />

            <ContainerPreference
              title="Informações da Loja"
              description="Atualize as informações da sua loja aqui."
            >
              <AddressContent
                errors={errors}
                getValues={getValues}
                register={register}
                setValue={setValue}
              />
            </ContainerPreference>

            <hr className="border border-gray-700" />

            <ContainerPreference
              title="Delivey da loja"
              description="Atualize as informações da sua loja aqui"
            >
              <Delivery
                errors={errors}
                store={store}
                getValues={getValues}
                register={register}
                setValue={setValue}
              />
            </ContainerPreference>
          </div>

          <div className="px-5 pb-5">
            <Button
              isLoading={isLoadingSubmit}
              disabled={isLoadingSubmit}
              type="submit"
            >
              salvar
            </Button>
          </div>
        </form>
      </section>

      <Toast
        open={toast.open}
        message={toast.message}
        setOpen={(open) => setToast({ ...toast, open })}
        type={toast.type}
      />
    </div>
  );
}
