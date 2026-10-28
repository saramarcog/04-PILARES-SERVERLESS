import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator
} from "react-native";
import { Zone, ZoneStatus } from "./src/types";
import {
  getZones,
  getZone,
  createZone,
  replaceZone,
  updateZoneStatus,
  deleteZone
} from "./src/api";

type Tab = "LISTADO" | "DETALLE" | "NUEVO" | "EDITAR";

export default function App() {
  const [tab, setTab] = useState<Tab>("LISTADO");
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverResult, setServerResult] = useState<any>(null);

  const [selectedId, setSelectedId] = useState("ZONE-01");
  const [detailZone, setDetailZone] = useState<Zone | null>(null);

  const [formName, setFormName] = useState("");
  const [formCapacity, setFormCapacity] = useState("");
  const [formStatus, setFormStatus] = useState<ZoneStatus>("OPEN");

  const loadList = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getZones();
      setZones(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar zonas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  const handleAction = async (actionName: string, task: () => Promise<any>) => {
    setBusy(true);
    setError(null);
    try {
      const res = await task();
      setServerResult({ action: actionName, data: res });
    } catch (err: any) {
      setError(`${actionName} falló: ${err.message}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.subTitle}>FESTIVAL OPERATIONS</Text>
        <Text style={styles.title}>VENUE CONTROL</Text>
      </View>

      <View style={styles.tabsContainer}>
        {(["LISTADO", "DETALLE", "NUEVO", "EDITAR"] as Tab[]).map((t) => (
          <Pressable
            key={t}
            style={[styles.tabButton, tab === t && styles.tabButtonActive]}
            onPress={() => {
              setTab(t);
              setServerResult(null);
              setError(null);
            }}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t}
            </Text>
          </Pressable>
        ))}
      </View>

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <ScrollView style={styles.content}>
 
        {tab === "LISTADO" && (
          <View>
            <View style={styles.rowBetween}>
              <Text style={styles.sectionTitle}>
                {zones.length} zonas en operación
              </Text>
              <Pressable
                style={styles.smallButton}
                onPress={loadList}
                disabled={loading}
              >
                <Text style={styles.smallButtonText}>
                  {loading ? "Cargando..." : "Recargar"}
                </Text>
              </Pressable>
            </View>

            {loading ? (
              <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
            ) : (
              zones.map((z) => (
                <View key={z.id} style={styles.card}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.cardTitle}>{z.name}</Text>
                    <Text
                      style={[
                        styles.badge,
                        z.status === "OPEN"
                          ? styles.badgeOpen
                          : z.status === "FULL"
                          ? styles.badgeFull
                          : styles.badgeClosed
                      ]}
                    >
                      • {z.status}
                    </Text>
                  </View>
                  <Text style={styles.cardId}>{z.id}</Text>
                  <Text style={styles.cardInfo}>
                    Capacidad: {z.capacity.toLocaleString()} personas
                  </Text>
                </View>
              ))
            )}
          </View>
        )}

        {tab === "DETALLE" && (
          <View style={styles.box}>
            <Text style={styles.label}>ID de Espacio:</Text>
            <TextInput
              style={styles.input}
              value={selectedId}
              onChangeText={setSelectedId}
              placeholder="ZONE-01"
              autoCapitalize="characters"
            />
            <Pressable
              style={[styles.actionBtn, busy && styles.btnDisabled]}
              disabled={busy}
              onPress={() =>
                handleAction("GET Detalle", async () => {
                  const res = await getZone(selectedId);
                  setDetailZone(res);
                  return res;
                })
              }
            >
              <Text style={styles.btnText}>GET /zones/{selectedId}</Text>
            </Pressable>

            {detailZone && (
              <View style={[styles.card, { marginTop: 16 }]}>
                <Text style={styles.cardTitle}>{detailZone.name}</Text>
                <Text style={styles.cardId}>{detailZone.id}</Text>
                <Text>Capacidad: {detailZone.capacity}</Text>
                <Text>Estado: {detailZone.status}</Text>
              </View>
            )}
          </View>
        )}

        {tab === "NUEVO" && (
          <View style={styles.box}>
            <Text style={styles.label}>Nombre de la Zona:</Text>
            <TextInput
              style={styles.input}
              value={formName}
              onChangeText={setFormName}
              placeholder="Ej. Escenario Acústico"
            />

            <Text style={styles.label}>Capacidad:</Text>
            <TextInput
              style={styles.input}
              value={formCapacity}
              onChangeText={setFormCapacity}
              placeholder="Ej. 1500"
              keyboardType="numeric"
            />

            <Pressable
              style={[styles.actionBtn, busy && styles.btnDisabled]}
              disabled={busy}
              onPress={() =>
                handleAction("POST Zona", () =>
                  createZone({
                    name: formName || "Zona sin nombre",
                    capacity: Number(formCapacity) || 1000,
                    status: "OPEN"
                  })
                )
              }
            >
              <Text style={styles.btnText}>POST /zones</Text>
            </Pressable>
          </View>
        )}

        {tab === "EDITAR" && (
          <View style={styles.box}>
            <Text style={styles.label}>ID Objetivo:</Text>
            <TextInput
              style={styles.input}
              value={selectedId}
              onChangeText={setSelectedId}
            />

            <Text style={styles.label}>Nuevo Estado (para PATCH):</Text>
            <View style={styles.statusButtonsRow}>
              {(["OPEN", "FULL", "CLOSED", "MAINTENANCE"] as ZoneStatus[]).map(
                (st) => (
                  <Pressable
                    key={st}
                    style={[
                      styles.statusSelectBtn,
                      formStatus === st && styles.statusSelectBtnActive
                    ]}
                    onPress={() => setFormStatus(st)}
                  >
                    <Text
                      style={[
                        styles.statusSelectText,
                        formStatus === st && styles.statusSelectTextActive
                      ]}
                    >
                      {st}
                    </Text>
                  </Pressable>
                )
              )}
            </View>

            <Pressable
              style={[styles.actionBtn, { backgroundColor: "#0284c7" }, busy && styles.btnDisabled]}
              disabled={busy}
              onPress={() =>
                handleAction("PATCH Estado", () =>
                  updateZoneStatus(selectedId, formStatus)
                )
              }
            >
              <Text style={styles.btnText}>PATCH /zones/{selectedId} ({formStatus})</Text>
            </Pressable>

            <Pressable
              style={[styles.actionBtn, { backgroundColor: "#d97706" }, busy && styles.btnDisabled]}
              disabled={busy}
              onPress={() =>
                handleAction("PUT Remplazar", () =>
                  replaceZone(selectedId, {
                    name: "Zona Actualizada",
                    capacity: 3500,
                    status: formStatus
                  })
                )
              }
            >
              <Text style={styles.btnText}>PUT /zones/{selectedId}</Text>
            </Pressable>

            <Pressable
              style={[styles.actionBtn, { backgroundColor: "#dc2626" }, busy && styles.btnDisabled]}
              disabled={busy}
              onPress={() =>
                handleAction("DELETE Eliminar", () => deleteZone(selectedId))
              }
            >
              <Text style={styles.btnText}>DELETE /zones/{selectedId}</Text>
            </Pressable>
          </View>
        )}

        {/* Consola de Respuesta del Servidor */}
        {serverResult && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>
              Respuesta del Servidor ({serverResult.action}):
            </Text>
            <Text style={styles.resultCode}>
              {JSON.stringify(serverResult.data, null, 2)}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", paddingTop: 40 },
  header: { paddingHorizontal: 20, marginBottom: 12 },
  subTitle: { fontSize: 12, fontWeight: "700", color: "#64748b", letterSpacing: 1 },
  title: { fontSize: 24, fontWeight: "900", color: "#0f172a" },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#e2e8f0",
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 3
  },
  tabButton: { flex: 1, paddingVertical: 8, alignItems: "center", borderRadius: 6 },
  tabButtonActive: { backgroundColor: "#ffffff" },
  tabText: { fontSize: 12, fontWeight: "700", color: "#64748b" },
  tabTextActive: { color: "#0f172a" },
  content: { flex: 1, padding: 16 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#334155" },
  smallButton: { backgroundColor: "#0f172a", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  smallButtonText: { color: "#ffffff", fontSize: 12, fontWeight: "600" },
  card: { backgroundColor: "#ffffff", padding: 16, borderRadius: 10, marginVertical: 6, borderWidth: 1, borderColor: "#e2e8f0" },
  cardTitle: { fontSize: 16, fontWeight: "800", color: "#0f172a" },
  cardId: { fontSize: 12, color: "#94a3b8", marginVertical: 4 },
  cardInfo: { fontSize: 14, color: "#475569" },
  badge: { fontSize: 11, fontWeight: "800", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeOpen: { backgroundColor: "#dcfce7", color: "#15803d" },
  badgeFull: { backgroundColor: "#fee2e2", color: "#b91c1c" },
  badgeClosed: { backgroundColor: "#f1f5f9", color: "#64748b" },
  box: { backgroundColor: "#ffffff", padding: 16, borderRadius: 8, borderWidth: 1, borderColor: "#e2e8f0" },
  label: { fontSize: 13, fontWeight: "700", color: "#475569", marginBottom: 4, marginTop: 8 },
  input: { borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 6, padding: 10, fontSize: 14, backgroundColor: "#f8fafc" },
  actionBtn: { backgroundColor: "#0f172a", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 12 },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: "#ffffff", fontWeight: "700", fontSize: 13 },
  statusButtonsRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 8 },
  statusSelectBtn: { paddingVertical: 6, paddingHorizontal: 8, borderRadius: 6, borderWidth: 1, borderColor: "#cbd5e1" },
  statusSelectBtnActive: { backgroundColor: "#0f172a", borderColor: "#0f172a" },
  statusSelectText: { fontSize: 11, fontWeight: "600", color: "#475569" },
  statusSelectTextActive: { color: "#ffffff" },
  resultContainer: { marginTop: 20, padding: 14, backgroundColor: "#0f172a", borderRadius: 8 },
  resultTitle: { color: "#38bdf8", fontWeight: "700", fontSize: 12, marginBottom: 6 },
  resultCode: { color: "#f8fafc", fontFamily: "monospace", fontSize: 12 },
  errorBox: { marginHorizontal: 16, backgroundColor: "#fee2e2", padding: 10, borderRadius: 6, marginTop: 8 },
  errorText: { color: "#b91c1c", fontSize: 12, fontWeight: "600" }
});