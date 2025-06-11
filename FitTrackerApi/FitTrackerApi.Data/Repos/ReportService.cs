using Data.Repos;
using FitTrackerApi.Data.Utils;
using Models;
using Models.Reportes;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using ScottPlot;
using System;
using Utils;

public class ReportService : IReportService
{
    private readonly IClienteRepository _clienteRepository;
    private readonly IEmpresaRepository _empresaRepository;

    public ReportService(IClienteRepository clienteRepository, IEmpresaRepository empresaRepository)
    {
        _clienteRepository = clienteRepository;
        _empresaRepository = empresaRepository;
    }

    public async Task<byte[]> GenerarReporteMetricasConGraficos(int codigoCliente)
    {
        var datos = await _clienteRepository.ObtenerMetricasConAnalisisAsync(codigoCliente);
        if (datos == null)
            throw new Exception("No se encontraron métricas para este cliente.");

        var clienteInfo = await _clienteRepository.GetCliente(codigoCliente);
        var empresa = await _empresaRepository.ObtenerConfiguracionAsync();

        using var stream = new MemoryStream();

        // Lista de todos los gráficos
        var graficos = new List<(string Titulo, float Cliente, float Sedentario, float Fitness)>
        {
            ("IMC", Convertidor.ToFloat(datos.Imc), 27, 22),
            ("% Grasa", Convertidor.ToFloat(datos.GrasaCorporal), 28, 14),
            ("Masa Muscular", Convertidor.ToFloat(datos.MasaMuscular), 28, 35),
            ("Press Banca", Convertidor.ToFloat(datos.RmPress), 40, 80),
            ("Sentadilla", Convertidor.ToFloat(datos.RmSentadilla), 60, 120),
            ("Peso Muerto", Convertidor.ToFloat(datos.RmPesoMuerto), 70, 140),
            ("Test Cooper", Convertidor.ToFloat(datos.TestCooper), 1600, 2600),
            ("FC Reposo", Convertidor.ToFloat(datos.FcReposo), 80, 55),
            ("Flexibilidad", Convertidor.ToFloat(datos.Flexibilidad), 15, 25),
            ("Salto Vertical", Convertidor.ToFloat(datos.SaltoVertical), 25, 50),
            ("RPE", Convertidor.ToFloat(datos.Rpe), 7, 5)
        };

        // Configuración para número de gráficos
        int columnas = 3; // 3 columnas

        Document.Create(doc =>
        {
            // Página única con todo el contenido
            doc.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(30);

                // Encabezado
                page.Header().Row(row =>
                {
                    // Logo con espacio a la derecha
                    if (!string.IsNullOrEmpty(empresa.Logo))
                    {
                        row.ConstantItem(60).Height(60).Image(empresa.Logo);
                    }
                    else
                    {
                        row.ConstantItem(60).Height(60);
                    }

                    // Espacio entre logo y texto
                    row.ConstantItem(15).Height(60);

                    // Resto del encabezado
                    row.RelativeItem()
                        .Column(col =>
                        {
                            col.Item().Text(empresa.NombreEmpresa)
                                .FontSize(18).Bold().FontColor(QuestPDF.Helpers.Colors.Blue.Medium);
                            col.Item().Text($"{empresa.Direccion}, {empresa.Ciudad}, {empresa.Provincia}")
                                .FontSize(10).FontColor(QuestPDF.Helpers.Colors.Grey.Darken2);
                            col.Item().Text($"Tel: {empresa.TelefonoEmpresa} | Email: {empresa.EmailEmpresa}")
                                .FontSize(10).FontColor(QuestPDF.Helpers.Colors.Grey.Darken2);
                        });
                    row.ConstantItem(140)
                        .Column(col =>
                        {
                            col.Item().Text($"Cliente: {clienteInfo.NombreCompleto}")
                                .FontSize(13).Bold();
                            var edad = DateTime.Today.Year - clienteInfo.FechaNacimiento.Year;
                            col.Item().Text($"Edad: {edad} años")
                                .FontSize(11);
                        });
                });

                page.Content().Column(col =>
                {
                    col.Spacing(12); // Reducido de 18 a 12 para ahorrar espacio

                    // Título principal
                    col.Item().Text("Reporte de Métricas y Análisis")
                        .FontSize(18).Bold().FontColor(QuestPDF.Helpers.Colors.Blue.Darken2).Underline();

                    col.Item().LineHorizontal(1).LineColor(QuestPDF.Helpers.Colors.Grey.Lighten2);

                    col.Item().PaddingTop(8).Text("Análisis por Sección") // Reducido de 10 a 8
                        .FontSize(14).Bold().FontColor(QuestPDF.Helpers.Colors.Blue.Darken2).Underline();
                    col.Item().PaddingBottom(6).Column(analisisCol => // Reducido de 8 a 6
                    {
                        foreach (var kv in datos.ResumenAnalisis)
                            analisisCol.Item().Text($"{kv.Key}: {kv.Value}")
                                .FontSize(10).FontColor(QuestPDF.Helpers.Colors.Grey.Darken2); // Reducido de 11 a 10
                    });

                    col.Item().LineHorizontal(1).LineColor(QuestPDF.Helpers.Colors.Grey.Lighten2);

                    col.Item().PaddingTop(8).Text("Indicadores Clave Comparativos") // Reducido de 10 a 8
                        .FontSize(14).Bold().FontColor(QuestPDF.Helpers.Colors.Blue.Darken2).Underline();

                    // LEYENDA COMÚN MEJORADA - con más espacio entre elementos
                    col.Item().PaddingTop(4).Row(row => 
                    {
                        row.AutoItem().Text("Leyenda: ").FontSize(9).Bold();
                        
                        row.AutoItem().Container().Height(10).Width(10)
                            .Background(QuestPDF.Helpers.Colors.Blue.Medium);
                        row.AutoItem().PaddingRight(8).Text(" Cliente").FontSize(9); // Añadido PaddingRight
                        
                        row.AutoItem().Container().Height(10).Width(10)
                            .Background(QuestPDF.Helpers.Colors.Grey.Medium);
                        row.AutoItem().PaddingRight(8).Text(" Sedentario").FontSize(9); // Añadido PaddingRight
                        
                        row.AutoItem().Container().Height(10).Width(10)
                            .Background(QuestPDF.Helpers.Colors.Green.Medium);
                        row.AutoItem().Text(" Fitness").FontSize(9);
                    });

                    // TODOS LOS GRÁFICOS EN UNA SOLA SECCIÓN
                    col.Item().PaddingTop(6).Grid(grid =>
                    {
                        grid.Columns(columnas);
                        // Iterar por todos los gráficos (sin límite)
                        for (int i = 0; i < graficos.Count; i++)
                        {
                            var g = graficos[i];
                            grid.Item().Column(barCol =>
                            {
                                barCol.Item().AspectRatio(0.8f) // Ajustado de 1.0f a 0.8f para que sean menos altos
                                    .Scale(0.8f) // Añadido Scale para hacerlos un poco más pequeños
                                    .Svg(size => CreateBarSvg(size, g.Titulo, g.Cliente, g.Sedentario, g.Fitness));
                            });
                        }
                    });

                    // Recomendaciones
                    col.Item().PaddingTop(8).LineHorizontal(1).LineColor(QuestPDF.Helpers.Colors.Grey.Lighten2);

                    col.Item().PaddingTop(8).Text("Recomendaciones")
                        .FontSize(14).Bold().FontColor(QuestPDF.Helpers.Colors.Blue.Darken2).Underline();
                    col.Item().PaddingTop(4).Column(recCol =>
                    {
                        foreach (var rec in datos.Recomendaciones)
                            recCol.Item().PaddingBottom(2).Text("• " + rec)
                                .FontSize(10).FontColor(QuestPDF.Helpers.Colors.Black); // Reducido de 11 a 10
                    });
                });

                page.Footer().AlignCenter().Text(txt =>
                {
                    txt.Span("Página ").FontSize(9);
                    txt.CurrentPageNumber().FontSize(9);
                    txt.Span(" de ").FontSize(9);
                    txt.TotalPages().FontSize(9);
                });
            });
            
            // ELIMINADA LA LÓGICA DE SEGUNDA PÁGINA
        })
        .GeneratePdf(stream);

        return stream.ToArray();
    }

    // Helper to build SVG bar chart
    private string CreateBarSvg(Size size, string title, float cliente, float sed, float fit)
    {
        var plt = new ScottPlot.Plot();
        double[] values = { cliente, sed, fit };
        var bars = plt.Add.Bars(values);

        // Colores de barras consistentes
        bars.Bars[0].FillColor = ScottPlot.Colors.Blue;
        bars.Bars[1].FillColor = ScottPlot.Colors.Gray;
        bars.Bars[2].FillColor = ScottPlot.Colors.Green;

        // Etiquetas numéricas simples en lugar de texto 
        plt.Axes.Bottom.TickGenerator = new ScottPlot.TickGenerators.NumericManual(
            new[] {
                new ScottPlot.Tick(0, "1"),
                new ScottPlot.Tick(1, "2"),
                new ScottPlot.Tick(2, "3")
            });

        // Título más prominente
        plt.Title(title, size: 12);
        
        // Establecer límite inferior en 0
        plt.Axes.Left.Min = 0;
        
        return plt.GetSvgXml((int)size.Width, (int)size.Height);
    }

    public async Task<byte[]> GenerarReporteHistorialDetalladoAsync(int codigoCliente)
    {
        var historial = await _clienteRepository.ObtenerHistorialCompletoAsync(codigoCliente);
        if (historial == null || !historial.Any())
            throw new Exception("No se encontró historial de métricas para este cliente.");

        var clienteInfo = await _clienteRepository.GetCliente(codigoCliente);
        var empresa = await _empresaRepository.ObtenerConfiguracionAsync();
        
        using var stream = new MemoryStream();

        Document.Create(doc =>
        {
            doc.Page(page =>
            {
                page.Margin(30);
                page.Size(PageSizes.A4);

                // Encabezado con datos de empresa
                page.Header().Row(row =>
                {
                    // Logo con espacio a la derecha
                    if (!string.IsNullOrEmpty(empresa.Logo))
                    {
                        row.ConstantItem(60).Height(60).Image(empresa.Logo);
                    }
                    else
                    {
                        row.ConstantItem(60).Height(60);
                    }

                    // Espacio entre logo y texto
                    row.ConstantItem(15).Height(60);

                    // Resto del encabezado
                    row.RelativeItem()
                        .Column(col =>
                        {
                            col.Item().Text(empresa.NombreEmpresa)
                                .FontSize(18).Bold().FontColor(QuestPDF.Helpers.Colors.Blue.Medium);
                            col.Item().Text($"{empresa.Direccion}, {empresa.Ciudad}, {empresa.Provincia}")
                                .FontSize(10).FontColor(QuestPDF.Helpers.Colors.Grey.Darken2);
                            col.Item().Text($"Tel: {empresa.TelefonoEmpresa} | Email: {empresa.EmailEmpresa}")
                                .FontSize(10).FontColor(QuestPDF.Helpers.Colors.Grey.Darken2);
                        });
                    row.ConstantItem(140)
                        .Column(col =>
                        {
                            col.Item().Text($"Cliente: {clienteInfo.NombreCompleto}")
                                .FontSize(13).Bold();
                            var edad = DateTime.Today.Year - clienteInfo.FechaNacimiento.Year;
                            col.Item().Text($"Edad: {edad} años")
                                .FontSize(11);
                        });
                });

                page.Content().Column(col =>
                {
                    col.Spacing(15);

                    // Título principal
                    col.Item().Text("Historial Completo de Métricas")
                        .FontSize(18).Bold().FontColor(QuestPDF.Helpers.Colors.Blue.Darken2).Underline();

                    // Para cada registro en el historial (ordenado por fecha descendente)
                    foreach (var registro in historial.OrderByDescending(h => h.FechaRegistro))
                    {
                        col.Item().Background(QuestPDF.Helpers.Colors.Grey.Lighten4).Padding(10).Column(entryCol =>
                        {
                            // Fecha de registro como encabezado
                            entryCol.Item().Text($"Registro: {registro.FechaRegistro.ToString("dd/MM/yyyy HH:mm")}")
                                .FontSize(14).Bold().FontColor(QuestPDF.Helpers.Colors.Blue.Medium);
                            
                            entryCol.Item().LineHorizontal(1).LineColor(QuestPDF.Helpers.Colors.Grey.Lighten2);
                            
                            // Métricas en 2 columnas
                            entryCol.Item().Row(row =>
                            {
                                // Columna izquierda
                                row.RelativeItem().Column(left =>
                                {
                                    left.Item().Text("Datos Antropométricos").FontSize(12).Bold().FontColor(QuestPDF.Helpers.Colors.Blue.Darken1);
                                    left.Item().Text($"IMC: {registro.IMC?.ToString("0.00") ?? "N/A"}").FontSize(10);
                                    left.Item().Text($"Grasa Corporal: {registro.GrasaCorporal?.ToString("0.0") ?? "N/A"}%").FontSize(10);
                                    left.Item().Text($"Masa Muscular: {registro.MasaMuscular?.ToString("0.0") ?? "N/A"}%").FontSize(10);
                                    
                                    left.Item().PaddingTop(8).Text("Cardio").FontSize(12).Bold().FontColor(QuestPDF.Helpers.Colors.Blue.Darken1);
                                    left.Item().Text($"Test Cooper: {registro.TestCooper?.ToString("0") ?? "N/A"} m").FontSize(10);
                                    left.Item().Text($"FC Reposo: {registro.FcReposo?.ToString("0") ?? "N/A"} lpm").FontSize(10);
                                });
                                
                                // Columna derecha
                                row.RelativeItem().Column(right =>
                                {
                                    right.Item().Text("Fuerza y Resistencia").FontSize(12).Bold().FontColor(QuestPDF.Helpers.Colors.Blue.Darken1);
                                    right.Item().Text($"RM Press Banca: {registro.RmPress?.ToString("0") ?? "N/A"} kg").FontSize(10);
                                    right.Item().Text($"RM Sentadilla: {registro.RmSentadilla?.ToString("0") ?? "N/A"} kg").FontSize(10);
                                    right.Item().Text($"RM Peso Muerto: {registro.RmPesoMuerto?.ToString("0") ?? "N/A"} kg").FontSize(10);
                                    
                                    right.Item().PaddingTop(8).Text("Otros Indicadores").FontSize(12).Bold().FontColor(QuestPDF.Helpers.Colors.Blue.Darken1);
                                    right.Item().Text($"Flexibilidad: {registro.TestFlexibilidad?.ToString("0") ?? "N/A"} cm").FontSize(10);
                                    right.Item().Text($"Salto Vertical: {registro.SaltoVertical?.ToString("0") ?? "N/A"} cm").FontSize(10);
                                    right.Item().Text($"RPE: {registro.Rpe?.ToString("0") ?? "N/A"}/10").FontSize(10);
                                });
                            });

                            // Resumen por sección (si existe)
                            if (registro.ResumenPorSeccion != null && registro.ResumenPorSeccion.Any())
                            {
                                entryCol.Item().PaddingTop(8).Text("Análisis por Sección")
                                    .FontSize(12).Bold().FontColor(QuestPDF.Helpers.Colors.Blue.Darken1);
                                
                                entryCol.Item().PaddingTop(2).Table(table =>
                                {
                                    table.ColumnsDefinition(cols =>
                                    {
                                        cols.RelativeColumn();
                                        cols.RelativeColumn(2);
                                    });

                                    foreach (var seccion in registro.ResumenPorSeccion)
                                    {
                                        if (!string.IsNullOrEmpty(seccion.Value))
                                        {
                                            table.Cell().Background(QuestPDF.Helpers.Colors.Grey.Lighten3)
                                                .Padding(5).Text(seccion.Key).FontSize(9).Bold();
                                            
                                            table.Cell().Padding(5).Text(seccion.Value).FontSize(9);
                                        }
                                    }
                                });
                            }
                        });
                        
                        // Pequeño espacio entre registros
                        col.Item().Height(10);
                    }

                    // Gráficos de evolución
                    col.Item().PaddingTop(10).Text("Gráficos de Evolución")
                        .FontSize(16).Bold().FontColor(QuestPDF.Helpers.Colors.Blue.Darken2).Underline();

                    void AddLineChart(string title, IEnumerable<(DateTime Fecha, double? Valor)> puntos)
                    {
                        col.Item().PaddingTop(5).Text(title).FontSize(12).Bold();

                        col.Item().AspectRatio(2).Svg(size =>
                        {
                            var plt = new ScottPlot.Plot();
                            // Ordenar puntos por fecha y tomar solo el último valor para cada fecha
                            var puntosValidos = puntos
                                .Where(p => p.Valor.HasValue)
                                .GroupBy(p => p.Fecha.Date) // Agrupar por fecha (sin hora)
                                .Select(g => g.OrderByDescending(x => x.Fecha).First()) // Tomar el registro más reciente de cada día
                                .OrderBy(p => p.Fecha)
                                .ToList();

                            if (puntosValidos.Any())
                            {
                                var xs = puntosValidos.Select(p => p.Fecha.ToOADate()).ToArray();
                                var ys = puntosValidos.Select(p => p.Valor.Value).ToArray();

                                var scatter = plt.Add.Scatter(xs, ys);
                                scatter.LineWidth = 2;
                                scatter.LineColor = ScottPlot.Colors.Blue;
                                scatter.MarkerSize = 5;

                                // Limitar número de etiquetas para evitar solapamiento
                                int maxTicks = Math.Min(7, puntosValidos.Count);
                                if (puntosValidos.Count > 0)
                                {
                                    var step = puntosValidos.Count <= maxTicks ? 1 : puntosValidos.Count / maxTicks;
                                    var selectedDates = new List<ScottPlot.Tick>();
                                    
                                    // Siempre incluir la primera y última fecha
                                    selectedDates.Add(new ScottPlot.Tick(
                                        puntosValidos.First().Fecha.ToOADate(),
                                        puntosValidos.First().Fecha.ToString("dd/MM")));
                                    
                                    // Añadir fechas intermedias espaciadas uniformemente
                                    for (int i = step; i < puntosValidos.Count - 1; i += step)
                                    {
                                        if (selectedDates.Count < maxTicks - 1) // Reservar espacio para la última fecha
                                        {
                                            selectedDates.Add(new ScottPlot.Tick(
                                                puntosValidos[i].Fecha.ToOADate(),
                                                puntosValidos[i].Fecha.ToString("dd/MM")));
                                        }
                                    }
                                    
                                    // Añadir la última fecha si no es la misma que la primera
                                    if (puntosValidos.Count > 1)
                                    {
                                        selectedDates.Add(new ScottPlot.Tick(
                                            puntosValidos.Last().Fecha.ToOADate(),
                                            puntosValidos.Last().Fecha.ToString("dd/MM")));
                                    }
                                    
                                    plt.Axes.Bottom.TickGenerator = new ScottPlot.TickGenerators.NumericManual(selectedDates.ToArray());
                                }

                                plt.Title(title);
                                plt.Axes.Left.Label.Text = "Valor";
                            }
                            else
                            {
                                plt.Title($"{title} - Sin datos");
                            }

                            return plt.GetSvgXml((int)size.Width, (int)size.Height);
                        });
                    }

                    // Gráficos seleccionados
                    AddLineChart("IMC", historial.Select(h => (h.FechaRegistro, (double?)h.IMC)));
                    AddLineChart("% Grasa Corporal", historial.Select(h => (h.FechaRegistro, (double?)h.GrasaCorporal)));
                    AddLineChart("RM Press Banca", historial.Select(h => (h.FechaRegistro, (double?)h.RmPress)));
                    AddLineChart("Test Cooper", historial.Select(h => (h.FechaRegistro, (double?)h.TestCooper)));
                });

                page.Footer().AlignCenter().Text(txt =>
                {
                    txt.Span("Página ").FontSize(9);
                    txt.CurrentPageNumber().FontSize(9);
                    txt.Span(" de ").FontSize(9);
                    txt.TotalPages().FontSize(9);
                });
            });
        })
        .GeneratePdf(stream);

        return stream.ToArray();
    }

}
