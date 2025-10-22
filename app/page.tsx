"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  FileText,
  CheckCircle,
  TriangleAlert,
  Hash,
  ArrowLeft,
  Users,
  FileCheck,
  Mail,
  GraduationCap,
  Award as IdCard,
  Download,
  Calendar,
  RotateCcw,
} from "lucide-react"

type FlowState = "input" | "confirmation" | "success"

interface ErrorType {
  type: "invalid-data" | "project-not-found" | "wrong-state" | "not-definitive" | "no-confirmed-applications"
  message: string
}

interface Student {
  id: string
  name: string
  dni: string
  email: string
  career: string
  postId: string
}

interface ProjectInfo {
  number: string
  name: string
  company: string
  status: string
}

interface Contract {
  id: string
  number: string
  studentName: string
}

export default function ContractEmissionSystem() {
  const [flowState, setFlowState] = useState<FlowState>("input")
  const [projectNumber, setProjectNumber] = useState("")
  const [error, setError] = useState<ErrorType | null>(null)
  const [contractsEmitted, setContractsEmitted] = useState<number>(0)
  const [shouldClearOnFocus, setShouldClearOnFocus] = useState(false)
  const [projectInfo, setProjectInfo] = useState<ProjectInfo | null>(null)
  const [confirmedStudents, setConfirmedStudents] = useState<Student[]>([])
  const [generatedContracts, setGeneratedContracts] = useState<Contract[]>([])
  const [emissionDate, setEmissionDate] = useState<string>("")
  const [isEmitting, setIsEmitting] = useState(false)

  const mockStudents: Student[] = [
    {
      id: "1",
      name: "Ana García Rodríguez",
      dni: "38345678",
      email: "ana.garcia@universidad.edu",
      career: "Ingeniería en Sistemas",
      postId: "00001",
    },
    {
      id: "2",
      name: "Carlos López Martínez",
      dni: "45654321",
      email: "carlos.lopez@universidad.edu",
      career: "Ingeniería Industrial",
      postId: "00002",
    },
    {
      id: "3",
      name: "María Fernández Silva",
      dni: "46223344",
      email: "maria.fernandez@universidad.edu",
      career: "Ingeniería en Sistemas",
      postId: "00003",
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const projectPattern = /^PRJ\d{3}$/
    if (!projectNumber.trim() || projectNumber.trim() === "" || !projectPattern.test(projectNumber.trim())) {
      setError({
        type: "invalid-data",
        message: "Los datos son incorrectos. Intenta nuevamente.",
      })
      setProjectNumber("") // Limpiar el campo inmediatamente
      setShouldClearOnFocus(true)
      return
    }

    setError(null)

    if (projectNumber === "PRJ001") {
      setError({
        type: "project-not-found",
        message: "No se ha podido encontrar el proyecto ingresado. Intente nuevamente",
      })
      setProjectNumber("") // Limpiar el campo inmediatamente
      setShouldClearOnFocus(true)
    } else if (projectNumber === "PRJ002") {
      setError({
        type: "wrong-state",
        message: 'El proyecto no esta en estado "En evaluación".',
      })
      setProjectNumber("") // Limpiar el campo inmediatamente
      setShouldClearOnFocus(true)
    } else if (projectNumber === "PRJ003") {
      setError({
        type: "not-definitive",
        message: 'El Proceso de Seleccion del Proyecto no está en estado "Definitivo".',
      })
      setProjectNumber("") // Limpiar el campo inmediatamente
      setShouldClearOnFocus(true)
    } else if (projectNumber === "PRJ004") {
      setError({
        type: "no-confirmed-applications",
        message: 'La postulación no está en estado "Confirmado".',
      })
      setProjectNumber("") // Limpiar el campo inmediatamente
      setShouldClearOnFocus(true)
    } else {
      setProjectInfo({
        number: projectNumber,
        name: "Sistema de Gestión Empresarial",
        company: "TechCorp S.A.",
        status: "En evaluación",
      })
      setConfirmedStudents(mockStudents)
      setFlowState("confirmation")
    }
  }

  const handleInputFocus = () => {
    if (shouldClearOnFocus) {
      setProjectNumber("")
      setError(null)
      setShouldClearOnFocus(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (shouldClearOnFocus) {
      setProjectNumber("")
      setError(null)
      setShouldClearOnFocus(false)
    } else {
      setProjectNumber(e.target.value.slice(0, 6))
      setError(null)
    }
  }

  const handleBack = () => {
    setFlowState("input")
    setProjectInfo(null)
    setConfirmedStudents([])
  }

  const handleCancel = () => {
    setFlowState("input")
    setProjectNumber("")
    setError(null)
    setProjectInfo(null)
    setConfirmedStudents([])
    setShouldClearOnFocus(false)
  }

  const handleEmitContracts = async () => {
    setIsEmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    const currentDate = new Date()
    const day = String(currentDate.getDate()).padStart(2, "0")
    const month = String(currentDate.getMonth() + 1).padStart(2, "0")
    const year = currentDate.getFullYear()
    const hours = String(currentDate.getHours()).padStart(2, "0")
    const minutes = String(currentDate.getMinutes()).padStart(2, "0")
    const seconds = String(currentDate.getSeconds()).padStart(2, "0")

    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`

    setEmissionDate(formattedDate)
    setContractsEmitted(confirmedStudents.length)

    const contracts = confirmedStudents.map((student, index) => ({
      id: student.id,
      number: `CONT-${projectInfo?.number}-${String(index + 1).padStart(3, "0")}`,
      studentName: student.name,
    }))

    setGeneratedContracts(contracts)
    setIsEmitting(false)
    setFlowState("success")
  }

  const resetFlow = () => {
    setFlowState("input")
    setProjectNumber("")
    setError(null)
    setContractsEmitted(0)
    setShouldClearOnFocus(false)
    setProjectInfo(null)
    setConfirmedStudents([])
    setGeneratedContracts([])
    setEmissionDate("")
    setIsEmitting(false)
  }

  const handleSendContract = (contractNumber: string) => {
    alert(`Enviando contrato ${contractNumber} por email...`)
  }

  const handleDownloadContract = (contractNumber: string) => {
    alert(`Descargando contrato ${contractNumber}...`)
  }

  const handleDownloadAll = () => {
    alert("Descargando todos los contratos...")
  }

  const handleSendAllByEmail = () => {
    alert("Enviando todos los contratos por email...")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Sistema de Prácticas Profesionales</h1>
        </div>

        {flowState === "input" && (
          <Card className="shadow-sm border-0 bg-white max-w-md mx-auto">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-12 h-12 flex items-center justify-center mb-2">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Emisión de Contrato</h2>
              <p className="text-sm text-gray-600 mt-2">
                Ingrese el número del proyecto del cual desea emitir los contratos
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="projectNumber" className="text-sm font-medium text-black">
                    Número de Proyecto <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="projectNumber"
                      type="text"
                      placeholder="Ej: PRJ006"
                      value={projectNumber}
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                      maxLength={6}
                      className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex items-start gap-3">
                      <TriangleAlert className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <p className="text-red-800 text-sm leading-relaxed">{error.message}</p>
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                  Continuar
                </Button>

                <Alert className="bg-blue-50 border-blue-200">
                  <AlertDescription className="text-sm text-blue-800">
                    <div className="font-bold mb-2 text-sm">Ejemplos para prueba:</div>
                    <div className="space-y-1 text-sm">
                      <div>• Ingrese cualquier número de Proyecto válido para continuar.</div>
                      <div>• Ingrese texto o números incompletos para simular datos no válidos.</div>
                      <div>• Ingrese "PRJ001" para simular proyecto no encontrado.</div>
                      <div>• Ingrese "PRJ002" para simular que el proyecto no está en estado "En evaluación".</div>
                      <div>• Ingrese "PRJ003" para simular que proceso no está en estado "Definitivo".</div>
                      <div>• Ingrese "PRJ004" para simular que la postulación no está en estado "Confirmado".</div>
                    </div>
                  </AlertDescription>
                </Alert>
              </form>
            </CardContent>
          </Card>
        )}

        {flowState === "confirmation" && projectInfo && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex items-center gap-2 bg-white text-black hover:text-gray-700 border-gray-300"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver
              </Button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Confirmar Emisión de Contratos</h2>
                <p className="text-gray-600">Revise la información antes de proceder con la emisión</p>
              </div>
            </div>

            <Card className="shadow-sm border-0 bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-gray-700" />
                  <h3 className="text-lg font-bold text-gray-900">Información del Proyecto</h3>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Número de Proyecto</p>
                    <p className="font-semibold text-gray-900">{projectInfo.number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Nombre del Proyecto</p>
                    <p className="font-semibold text-gray-900">{projectInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Empresa</p>
                    <p className="font-semibold text-gray-900">{projectInfo.company}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Estado</p>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-green-700 font-medium">{projectInfo.status}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-0 bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-700" />
                  <h3 className="text-lg font-bold text-gray-900">Estudiantes Confirmados</h3>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full">
                    {confirmedStudents.length}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Los siguientes estudiantes tienen postulaciones confirmadas y recibirán contratos
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {confirmedStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-semibold text-gray-900">{student.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <IdCard className="w-3 h-3" />
                            <span>DNI: {student.dni}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            <span>{student.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <GraduationCap className="w-3 h-3" />
                            <span>{student.career}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-700 bg-white px-3 py-1 rounded border">
                      {student.postId}
                    </div>
                  </div>
                ))}

                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-sm text-green-800">
                      Se emitirán <span className="font-bold">{confirmedStudents.length} contratos</span> para los
                      estudiantes confirmados del proyecto <span className="font-bold">{projectInfo.number}</span>. Esta
                      acción no se puede deshacer.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleEmitContracts}
                    disabled={isEmitting}
                    className="bg-gray-900 hover:bg-gray-800 text-white disabled:opacity-50"
                  >
                    <FileCheck className="w-4 h-4 mr-2" />
                    {isEmitting ? "Emitiendo..." : "Emitir Contratos"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {flowState === "success" && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <h2 className="text-lg font-bold text-green-800">¡Contratos Emitidos Exitosamente!</h2>
                  <p className="text-sm text-green-700">Se han emitido {contractsEmitted} contratos correctamente</p>
                </div>
              </div>
            </div>

            <Card className="shadow-sm border-0 bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-700" />
                  <h3 className="text-lg font-bold text-gray-900">Detalles de la Emisión</h3>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Fecha de Emisión</p>
                    <p className="font-semibold text-gray-900">{emissionDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Fecha de Inicio</p>
                    <p className="font-semibold text-gray-900">{emissionDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Estado Contrato</p>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-green-700 font-medium">Emitido</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Contratos Emitidos</p>
                    <p className="font-semibold text-gray-900">{contractsEmitted}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Estado Proyecto</p>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-green-700 font-medium">Finalizado</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-0 bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-700" />
                  <h3 className="text-lg font-bold text-gray-900">Contratos Generados</h3>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Puede descargar o enviar por email cada contrato individualmente
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {generatedContracts.map((contract) => (
                  <div key={contract.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <h4 className="font-semibold text-gray-900">{contract.number}</h4>
                        <p className="text-sm text-gray-600">Contrato de Prácticas Profesionales</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendContract(contract.number)}
                        className="flex items-center gap-1"
                      >
                        <Mail className="w-4 h-4" />
                        Enviar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadContract(contract.number)}
                        className="flex items-center gap-1"
                      >
                        <Download className="w-4 h-4" />
                        Descargar
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="flex justify-center flex-wrap gap-3 mt-6 pt-4 border-t">
                  <Button variant="outline" onClick={resetFlow} className="flex items-center gap-2 bg-transparent">
                    <RotateCcw className="w-4 h-4" />
                    Emitir Nuevos Contratos
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleDownloadAll}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <Download className="w-4 h-4" />
                    Descargar Todos los Contratos
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleSendAllByEmail}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <Mail className="w-4 h-4" />
                    Enviar Todos por Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
